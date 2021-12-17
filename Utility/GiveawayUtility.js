const config = require('../Configuration/YML').getConfiguration()
const GiveawayDatabase = require('../Database/Models/GiveawaysModel')
const schedule = require('node-schedule')
const functions = require('./Functions')
const ms = require('ms')
const moment = require('moment')


module.exports.getResponses = async (bot, channel, UserID) => {
    let ShouldBreak = false;
    let GiveawayQuestions = ["`What is the prize of the giveaway?`", "`How long will this giveaway last?`", "`How many winners will there be?`"]
    const filter = msg => msg.author.id == UserID;
    let Responses = {}

    for(let i = 0; i < GiveawayQuestions.length; i++) {
        if(ShouldBreak) break;
        await channel.send({ content: GiveawayQuestions[i]})
        let AwaitResponse = await channel.awaitMessages({ filter, max: 1, time: 60000 })

        let Response = AwaitResponse.first();
        if(!Response) return

        switch(i) {
            case 0:
                Responses.Prize = Response.content
            break

            case 1:
                let Time = ms(Response.content)
                if(!Time) {
                    channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}---Invalid time response, please try again`])]})
                    ShouldBreak = true
                    break
                }
                
                Responses.EndsOn = Time
            break

            case 2:
                if(isNaN(Response)) {
                    channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}---Invalid winner response, please try again`])]})
                    ShouldBreak = true
                    break
                }
                Responses.WinnerLength = Response.content
            break
        }
    }

    return Responses
}


module.exports.saveGiveaway = (response) => {
    const GiveawayDocument = new GiveawayDatabase({
        ChannelID: response.ChannelID,
        MessageID: response.MessageID,
        Prize: response.Prize,
        WinnerLength: response.WinnerLength,
        EndsOn: response.EndsOn
    })
    return GiveawayDocument.save()
}

module.exports.scheduleGiveaway = async (bot, Giveaways) => {
    for(Giveaway of Giveaways) {

        if(moment().diff(Giveaway.EndsOn) > 0) {
            exports.endGiveaway(bot, Giveaway)

            continue
        }

        console.log(`Scheduling Giveaway for ${moment(Giveaway.EndsOn).tz('America/New_York').format("dddd, MMMM Do, h:mm a")} EST`)
        schedule.scheduleJob(Giveaway.EndsOn, () => { 
            exports.endGiveaway(bot, Giveaway)
        })
    }
}

module.exports.endGiveaway = async (bot, Giveaway) => {
        let GiveawayChannel = bot.channels.cache.get(Giveaway.ChannelID)
        if(!GiveawayChannel) {
            Giveaway.Active = false;

            await exports.updateGiveaway(Giveaway)
            return;
        }

        let GiveawayMessage = await GiveawayChannel.messages.fetch(Giveaway.MessageID).catch(err => { return })
        if(!GiveawayMessage) {
            Giveaway.Active = false;

            await exports.updateGiveaway(Giveaway)
            return;
        }

        let Reactions = GiveawayMessage.reactions.cache.get("🎉")
        if(!Reactions) {
            Giveaway.Active = false;

            await exports.updateGiveaway(Giveaway)
            return;
        }

        let Users = await Reactions.users.fetch()
        let Entries = Users

        while(Users.size === 100) {
            const LastUser = Users.last()

            Users = Reactions.users.fetch({ after: LastUser.id })

            Entries = Entries.concat(Users)
        }
        
        Entries = [...Entries.values()]
        let Winners = exports.determineWinners(Entries, Giveaway.WinnerLength, GiveawayChannel.guild)

        await exports.updateGiveaway(Giveaway)

        await GiveawayChannel.send({ embeds: [ functions.EmbedGenerator(bot, config.GiveawayEmbeds.GiveawayWinners, [`{Winners}---${Winners.map(user => user.toString()).join(" ")}`, `{GiveawayLink}---https://discord.com/channels/${config.GuildID}/${Giveaway.ChannelID}/${Giveaway.MessageID}`])]})
}

module.exports.determineWinners = (Entries, Max) => {
    if(Entries.length <= Max) return Entries

    let ChoosenNumbers = []
    let WinnersArray = []

    while(WinnersArray != Max) {
        let Random = Math.floor(Math.random() * Entries.length)
        let SelectedUser = Entries[Random]

        let member = Guild.members.cache.get(SelectedUser.id)
        if(!ChoosenNumbers.includes(Random) && !SelectedUser.bot && member) {
            WinnersArray.push(member.first().toString())
        }
    }

    return WinnersArray
}

module.exports.updateGiveaway = async (Giveaway) => {
    let Document = await GiveawayDatabase.findOne({ MessageID: Giveaway.MessageID })
    Document.Active = false;

    await Document.save()
}
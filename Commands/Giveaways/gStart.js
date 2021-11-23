const Discord = require('discord.js')
const functions = require('../../Utility/Functions')
const GiveawayUtility = require('../../Utility/GiveawayUtility')
const config = require('../../Configuration/YML').getConfiguration();
const moment = require('moment-timezone')

module.exports.run = async (bot, message, args) => {

    let ChannelID = args[0]
    if(!ChannelID) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    let GiveawayChannel = message.guild.channels.cache.find(channel => channel.id === ChannelID)
    if(!GiveawayChannel) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}---${ChannelID} is not a valid channel`], message.author)] })
    

    let GiveawayInformation = await GiveawayUtility.getResponses(bot, message.channel, message.author.id)
    if(Object.keys(GiveawayInformation).length < 3) return

    GiveawayInformation.ChannelID = ChannelID
    GiveawayInformation.EndsOn = new Date(Date.now() + GiveawayInformation.EndsOn)
    let GiveawayMessage = await GiveawayChannel.send({ embeds: [functions.EmbedGenerator(bot, config.GiveawayEmbeds.Giveaway, [`{Prize}---${GiveawayInformation.Prize}`, `{EndDate}---${moment(GiveawayInformation.EndsOn).tz('America/New_York').format("dddd, MMMM Do, h:mm a")} EST`, `{WinnerLength}---${GiveawayInformation.WinnerLength}`])] })
    await GiveawayMessage.react("🎉")
    GiveawayInformation.MessageID = GiveawayMessage.id

    await GiveawayUtility.saveGiveaway(GiveawayInformation)
    await GiveawayUtility.scheduleGiveaway(bot, [GiveawayInformation])
}

const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
module.exports.help = {
    name: CommandHelp.GiveawayCommands.gStart.name,
    description: CommandHelp.GiveawayCommands.gStart.description,
    usage: CommandHelp.GiveawayCommands.gStart.usage,
    aliases: CommandHelp.GiveawayCommands.gStart.aliases,
    permissions: CommandHelp.GiveawayCommands.gStart.permissions,
    cooldown: CommandHelp.GiveawayCommands.gStart.cooldown,
    enabled: CommandHelp.GiveawayCommands.gStart.enabled
}
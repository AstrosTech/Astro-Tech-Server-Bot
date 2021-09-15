const Discord = require('discord.js');
const config = require('../Configuration/YML').LoadConfiguration();
const moment = require('moment-timezone');
const chalk = require('chalk')
const figlet = require('figlet');


module.exports.Start = (bot) => {
    let Guild = bot.guilds.cache.get(config.GuildID)
    if(!Guild) {
        console.log(chalk.bold(chalk.cyan("[Astro Tech] ") + "»" + chalk.white(" GuildID set incorrectly in the configuration. Bot turning off...")))
        process.exit()
    }
    figlet.text("Astro Tech", function (err, data) { if(err) console.trace(err); console.log(chalk.bold(chalk.blueBright(data) + chalk.white(`\nBot Information`) + chalk.white(`\n\u2003\u2003\u2003Username: `) + chalk.green(`${bot.user.username}`) + chalk.white(`\n\u2003\u2003\u2003ID: `) + chalk.green(`${bot.user.id}`) + chalk.white(`\n\u2003\u2003\u2003Guilds: `) + chalk.green(`${bot.guilds.cache.map(guild => guild.name).join(", ")}`))) })

    exports.SetupTickets(bot, Guild)
    exports.SetupVerification(bot, Guild)
    exports.Status(bot)
    exports.Statistics(bot, Guild)
}

module.exports.Status = (bot) => {
    let ActivityNumber = 1;

    let ActivityLength = Object.keys(config.Activities).length

    if(ActivityLength == 0) return

    let ActivityObject = Object.values(config.Activities)
    let Activity = ActivityObject[0]
    bot.user.setActivity({ type: Activity.Type, name: Activity.Content })

    setInterval(() => {
        let ActivityObject = Object.values(config.Activities)
        let Activity = ActivityObject[ActivityNumber]
        bot.user.setActivity({ type: Activity.Type, name: Activity.Content })

        if(ActivityNumber == ActivityLength - 1) return ActivityNumber = 1

        ActivityNumber++
    }, config.ActivityRefreshRate);
}

module.exports.SetupTickets = async (bot, Guild) => {
    if(config.VerificationEnabled != true) return exports.LogToConsole("Verification Disabled.")

    let VerificationChannel = Guild.channels.cache.find(channel => channel.id == config.VerificationChannelID)
    if(!VerificationChannel) return exports.LogToConsole("VerificationChannelID set incorrectly. Verification Disabled.")
    
    try{
        await VerificationChannel.messages.fetch(config.VerificationMessageID)
    } catch(err) {
        const CreateVerificationButton = new Discord.MessageActionRow()
        .addComponents(new Discord.MessageButton().setCustomId('VerificationButton').setLabel(exports.Placeholders(bot, config.VerificationButton.Label, null, null)).setStyle(config.VerificationButton.Style),);

        let VerificationMessageEmbed = await VerificationChannel.send({ components: [CreateVerificationButton], embeds: [exports.EmbedGenerator(bot, config.VerificationEmbeds.Verify, null)]})
        exports.LogToConsole(`Verify Embed Sent. Please update the config with the new MessageID.\nMessage ID: ${VerificationMessageEmbed.id}`)
    }
}

module.exports.SetupVerification = async (bot, Guild) => {
    if(config.TicketsEnabled != true) return exports.LogToConsole("Tickets Disabled.")

    let TicketChannel = Guild.channels.cache.find(channel => channel.id == config.TicketChannelID)
    if(!TicketChannel) return exports.LogToConsole("TicketChannelID set incorrectly. Tickets Disabled.")
    
    try{
        await TicketChannel.messages.fetch(config.TicketMessageID)
    } catch(err) {
        const CreateTicketButton = new Discord.MessageActionRow()
        .addComponents(new Discord.MessageButton().setCustomId('TicketButton').setLabel(exports.Placeholders(bot, config.TicketButton.Label, null, null)).setStyle(config.TicketButton.Style),);

        let TicketMessageEmbed = await TicketChannel.send({ components: [CreateTicketButton], embeds: [exports.EmbedGenerator(bot, config.TicketEmbeds.CreateTicket, null)]})
        exports.LogToConsole(`Create Ticket Embed Sent. Please update the config with the new MessageID.\nMessage ID: ${TicketMessageEmbed.id}`)
    }
}

module.exports.LogToConsole = (log) => {
    console.log(chalk.bold(chalk.cyan("[Astro Tech] » ") + chalk.white(log)))
}

module.exports.Placeholders = (bot, message, user, placeholders) => {
    if(typeof message != "string") return
    let ReplacedMessage = message
    
    if(placeholders != null) {
        for (let i = 0; i < placeholders.length; i++) {
            let Placeholder = placeholders[i]

            let SplitPlaceholders = Placeholder.split(":")
            ReplacedMessage = ReplacedMessage.replace(SplitPlaceholders[0], SplitPlaceholders[1])
        }
    }
    if(user != null) {
        ReplacedMessage = ReplacedMessage
        .replace("{UserID}", user.id)
        .replace("{Username}", user.username)
        .replace("{CreatedOn}", moment(user.createdAt).format('llll'))
        .replace("{UserDiscriminator}", user.discriminator)
    }
    let Guild = bot.guilds.cache.get(config.GuildID)
    
    ReplacedMessage = ReplacedMessage
    .replace("{GuildID}", Guild.id)
    .replace("{Security}", Guild.verificationLevel)
    .replace("{CreatedAt}", `${Guild.createdAt.getMonth()}/${Guild.createdAt.getDate()}/${Guild.createdAt.getFullYear()}`)
    .replace("{TotalChannels}", Guild.channels.cache.size)
    .replace("{TextChannelSize}", Guild.channels.cache.filter(channel => channel.type === "GUILD_TEXT").size)
    .replace("{VoiceChannelSize}", Guild.channels.cache.filter(channel => channel.type === "GUILD_VOICE").size)
    .replace("{CategorySize}", Guild.channels.cache.filter(channel => channel.type === "GUILD_CATEGORY").size)
    .replace("{TotalMembers}", Guild.memberCount)
    .replace("{TotalUsers}", Guild.members.cache.filter(member => !member.user.bot).size)
    .replace("{TotalBots}", Guild.members.cache.filter(member => member.user.bot).size)
    .replace("{ServerName}", config.ServerName)
    .replace("{ServerColor}", config.ServerColor)
    .replace("{TimeStamp}", `${moment().tz('America/New_York').format("dddd, MMMM Do, h:mm a")} EST`)
    
    return ReplacedMessage
}


module.exports.EmbedGenerator = (bot, EmbedInformation, Placeholders, User) => {
        let Embed = new Discord.MessageEmbed()
    
        if(EmbedInformation.Title.length > 0) Embed.setTitle(exports.Placeholders(bot, EmbedInformation.Title, User, Placeholders))
        if(EmbedInformation.Color.length > 0) Embed.setColor(exports.Placeholders(bot, EmbedInformation.Color, User))
        if(EmbedInformation.Thumbnail.length > 0) Embed.setThumbnail(EmbedInformation.Thumbnail)

        if(EmbedInformation.Description.length > 0) Embed.setDescription(exports.Placeholders(bot, EmbedInformation.Description, User, Placeholders))
        
        if(EmbedInformation.Fields != null) {
            if(Object.keys(EmbedInformation.Fields).length > 0) { 
                for(FieldInformation of Object.values(EmbedInformation.Fields)) { 
                    Embed.addField(exports.Placeholders(bot, FieldInformation.Name, User, Placeholders), exports.Placeholders(bot, FieldInformation.Value, User, Placeholders), exports.Placeholders(bot, FieldInformation.Inline, User, Placeholders)) 
                } 
            }
        }

        if(EmbedInformation.Image.length > 0) Embed.setImage(exports.Placeholders(bot, EmbedInformation.Image, User, Placeholders))
        if(EmbedInformation.Footer.length > 0) Embed.setFooter(exports.Placeholders(bot, EmbedInformation.Footer, User, Placeholders))
        
        return Embed
}

module.exports.Statistics = async (bot, Guild) => {

    for(Statistic of Object.values(config.Statistics)) {

        let StatisticChannel = Guild.channels.cache.find(channel => channel.id == Statistic.ChannelID)
        if(!StatisticChannel) return exports.LogToConsole(`Statistics: ${Statistic.ChannelID} is not a channel id.`)

        await StatisticChannel.setName(exports.Placeholders(bot, Statistic.Format, null, null)).catch(err => { console.log(err) })
    }
}



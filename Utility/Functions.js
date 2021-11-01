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
    figlet.text("Astro Tech", function (err, data) { if(err) console.trace(err); console.log(chalk.bold(chalk.blueBright(data) + chalk.white(`\nBot Information:`) + chalk.white(`\n\u2003\u2003\u2003Username: `) + chalk.green(`${bot.user.username}`) + chalk.white(`\n\u2003\u2003\u2003ID: `) + chalk.green(`${bot.user.id}`) + chalk.white(`\n\u2003\u2003\u2003Guilds: `) + chalk.green(`${bot.guilds.cache.map(guild => guild.name).join(", ")}`) + chalk.white(`\n\u2003\u2003\u2003Start Time: `) + chalk.green(`${moment().tz('America/New_York').format("dddd, MMMM Do, h:mm a")} EST`))) })

    exports.SetupTickets(bot, Guild)
    exports.SetupVerification(bot, Guild)
    exports.Status(bot)
    exports.Statistics(bot, Guild)
    exports.SetupSuggestions(bot, Guild)
    exports.SetupReactRoles(bot, Guild)
}

module.exports.SetupReactRoles = async (bot, Guild) => {
    if(config.ReactRolesEnabled != true) return exports.LogToConsole("React Roles Disabled.")

    let ReactRolesChannel = Guild.channels.cache.find(channel => channel.id == config.ReactRolesChannelID)
    if(!ReactRolesChannel) return exports.LogToConsole("ReactRolesChannelID set incorrectly. React Roles Disabled.")
    
    let row = new Discord.MessageActionRow()
    try{
        await ReactRolesChannel.messages.fetch(config.ReactRolesMessageID)
    } catch(err) {
        for(ReactRolesCategory in config.ReactRoles) {
            let ReactRole = config.ReactRoles[ReactRolesCategory]

            if(ReactRole.RoleID.length == 0) {
                exports.LogToConsole(`${ReactRolesCategory} RoleID is blank. Skipping react role...`)
                continue
            }

            if(ReactRole.ButtonLabel.length == 0) {
                exports.LogToConsole(`${ReactRolesCategory} ButtonLabel is blank. Skipping react role...`)
                continue
            }

            let ReactRoleButton = new Discord.MessageButton()
            .setCustomId(ReactRolesCategory)
            .setLabel(exports.Placeholders(bot, ReactRole.ButtonLabel, null, null))
            .setStyle(ReactRole.ButtonStyle)
            row.addComponents(ReactRoleButton)
        }
        await ReactRolesChannel.send({ components: [ row ], embeds: [ exports.EmbedGenerator(bot, config.ReactRoleEmbeds.ReactRoleMessage, null, null)] })
    }
}

module.exports.Status = (bot) => {
    let ActivityNumber = 1;

    let ActivityLength = Object.keys(config.Activities).length
    if(ActivityLength == 0) return

    let ActivityObject = Object.values(config.Activities)
    let Activity = ActivityObject[0]
    
    if(ActivityLength == 1) return bot.user.setActivity({ type: Activity.Type, name: exports.Placeholders(bot, Activity.Content, null, null) })

    setInterval(() => {
        let ActivityObject = Object.values(config.Activities)
        let Activity = ActivityObject[ActivityNumber]

        bot.user.setActivity({ type: Activity.Type, name: exports.Placeholders(bot, Activity.Content, null, null) })

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

SuggestionMessageID = null;
module.exports.SetupSuggestions = async (bot, Guild) => {
    if(config.SuggestionCreateChannel.Enabled != true) return;

    let SuggestionChannel = Guild.channels.cache.find(channel => channel.id == config.SuggestionCreateChannel.SuggestChannelID)
    if(!SuggestionChannel) return exports.LogToConsole('SuggestionCreateChannel.SuggestChannelID set incorrectly in the configuration. Suggestions may not be made.')

    await SuggestionChannel.bulkDelete(100).catch(err => { return })

    let PendingChannel = Guild.channels.cache.find(channel => channel.id == config.SuggestionChannelIDS.Pending)
    if(!PendingChannel) exports.LogToConsole('SuggestionChannelIDS.Pending set incorrectly in the configuration. Suggestions may not be made.')

    let ApprovedChannel = Guild.channels.cache.find(channel => channel.id == config.SuggestionChannelIDS.Pending)
    if(!ApprovedChannel) exports.LogToConsole('SuggestionChannelIDS.Pending set incorrectly in the configuration. Cannot approve suggestions')

    let DeniedChannel = Guild.channels.cache.find(channel => channel.id == config.SuggestionChannelIDS.Pending)
    if(!DeniedChannel) exports.LogToConsole('SuggestionChannelIDS.Pending set incorrectly in the configuration. Cannot deny suggestions')

    let SuggestionMessage = await SuggestionChannel.send({ embeds: [exports.EmbedGenerator(bot, config.SuggestionEmbeds.SuggestionRulesEmbed, [`{PendingChannel}:${PendingChannel.toString()}`, `{ApprovedChannel}:${ApprovedChannel.toString()}`, `{DeniedChannel}:${DeniedChannel.toString()}`])] })
    SuggestionMessageID = SuggestionMessage.id
}

module.exports.getSuggestionMessageID = () => { return SuggestionMessageID }

module.exports.LogToConsole = (log) => {
    console.log(chalk.bold(chalk.cyan("[Astro Tech] » ") + chalk.white(log)))
}

module.exports.Placeholders = (bot, message, user, placeholders) => {
    if(typeof message != "string") return
    let ReplacedMessage = message
    
    if(placeholders != null) {
        for (let i = 0; i < placeholders.length; i++) {
            let Placeholder = placeholders[i]

            let SplitPlaceholders;
            if(Placeholder.includes('--')) SplitPlaceholders = Placeholder.split('--');
            else SplitPlaceholders = Placeholder.split(":")
            ReplacedMessage = ReplacedMessage.replace(SplitPlaceholders[0], SplitPlaceholders[1])
        }
    }

    if(user != null) {
        let AvatarURL;
        if(user.avatar) AvatarURL = user.avatarURL()
        else AvatarURL = "https://cdn.discordapp.com/embed/avatars/0.png"

        ReplacedMessage = ReplacedMessage
        .replace("{UserID}", user.id)
        .replace("{Username}", user.username)
        .replace("{CreatedOn}", moment(user.createdAt).format('llll'))
        .replace("{UserDiscriminator}", user.discriminator)
        .replace("{UserPing}", user.toString())
        .replace("{AvatarURL}", AvatarURL)
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

    
    let regex = /\((.*?)\)/g;
    while(found = regex.exec(ReplacedMessage)) {
        let ID = found[1]

        let ChannelCheck = Guild.channels.cache.find(channel => channel.id == ID)
        if(ChannelCheck) {
            ReplacedMessage = ReplacedMessage.replace(found[0], ChannelCheck.toString())
            continue
        }
        
        let RoleCheck = Guild.roles.cache.find(role => role.id == ID)
        if(RoleCheck) {
            ReplacedMessage = ReplacedMessage.replace(found[0], RoleCheck.toString())
            continue
        }

        let MemberCheck = Guild.members.cache.get(ID)
        if(MemberCheck) {
            ReplacedMessage = ReplacedMessage.replace(found[0], MemberCheck.toString())
            continue
        }

        let EmojiCheck = Guild.emojis.cache.find(emoji => emoji.id == ID)
        if(EmojiCheck) {
            ReplacedMessage = ReplacedMessage.replace(found[0], EmojiCheck)
            continue
        }
    }

    return ReplacedMessage
}


module.exports.EmbedGenerator = (bot, EmbedInformation, Placeholders, User) => {
        let Embed = new Discord.MessageEmbed()
    
        if(EmbedInformation.Title && EmbedInformation.Title.length > 0) Embed.setTitle(exports.Placeholders(bot, EmbedInformation.Title, User, Placeholders))
        if(EmbedInformation.Color && EmbedInformation.Color.length > 0) Embed.setColor(exports.Placeholders(bot, EmbedInformation.Color, User))
        if(EmbedInformation.Thumbnail && EmbedInformation.Thumbnail.length > 0) Embed.setThumbnail(exports.Placeholders(bot, EmbedInformation.Thumbnail, User, Placeholders))

        if(EmbedInformation.Description && EmbedInformation.Description.length > 0) Embed.setDescription(exports.Placeholders(bot, EmbedInformation.Description, User, Placeholders))
        
        if(EmbedInformation.Fields != null) {
            if(Object.keys(EmbedInformation.Fields).length > 0) { 
                for(FieldInformation of Object.values(EmbedInformation.Fields)) { 
                    Embed.addField(exports.Placeholders(bot, FieldInformation.Name, User, Placeholders), exports.Placeholders(bot, FieldInformation.Value, User, Placeholders), exports.Placeholders(bot, FieldInformation.Inline, User, Placeholders)) 
                } 
            }
        }

        let AvatarURL;
        if(user.avatar) AvatarURL = user.avatarURL()
        else AvatarURL = "https://cdn.discordapp.com/embed/avatars/0.png"

        if(EmbedInformation.Author && EmbedInformation.Author.length > 0) Embed.setAuthor(exports.Placeholders(bot, EmbedInformation.Author, User, Placeholders), AvatarURL)

        if(EmbedInformation.Image && EmbedInformation.Image.length > 0) Embed.setImage(exports.Placeholders(bot, EmbedInformation.Image, User, Placeholders))
        if(EmbedInformation.Footer && EmbedInformation.Footer.length > 0) Embed.setFooter(exports.Placeholders(bot, EmbedInformation.Footer, User, Placeholders))
        
        return Embed
}

module.exports.Statistics = async (bot, Guild) => {
    
    if(!config.Statistics) return;
    
    for(Statistic of Object.values(config.Statistics)) {

        let StatisticChannel = Guild.channels.cache.find(channel => channel.id == Statistic.ChannelID)
        if(!StatisticChannel) return exports.LogToConsole(`Statistics: ${Statistic.ChannelID} is not a channel id.`)

        await StatisticChannel.setName(exports.Placeholders(bot, Statistic.Format, null, null)).catch(err => { console.log(err) })
    }
}

module.exports.VerifyPermissions = async (Permissions, Member) => {

    if(!Permissions) return false;
    
    if(Permissions.some(AllowedRole => Member.roles.cache.find(userrole => userrole.id === AllowedRole))) return true;

    if(Permissions.some(AllowedUsers => Member.user.id == AllowedUsers)) return true;


    let MemberPermissions = Member.permissions.serialize();
    if(Permissions.some(AllowedPermissions => MemberPermissions[AllowedPermissions])) return true;

    return false;
}


module.exports.InsufficientPermissions = async (bot, Guild, Help, User, Channel) => {
    let Permissions = []

    for(Permission of Help.permissions) {
        
        let RoleCheck = await Guild.roles.cache.find(role => role.id === Permission)
        if(RoleCheck) {
            Permissions.push(RoleCheck.toString())
            continue;
        }

        let MemberCheck = await Guild.members.cache.get(Permission)
        if(MemberCheck) {
            Permissions.push(MemberCheck.toString())
            continue;
        }
        Permissions.push(Permission)
    }
    
    if(Help.usage.length > 1) Help.usage = "No Usage Provided."
    if(Help.description.length > 1) Help.description = "No Description Provided"
    if(!Help.aliases[0]) Help.aliases = "No aliases"
    if(Permissions.length > 1) Permissions = "No Permissions Provided"
    
    Channel.send({ embeds: [exports.EmbedGenerator(bot, config.GeneralEmbeds.InsufficientPermission, [`{Command}:${Help.name}`, `{Description}:${Help.description}`, `{Usage}:${Help.usage}`, `{Aliases}:${Help.aliases}`, `{Permissions}:${Permissions}`], User)] })
}

module.exports.InsufficientUsage = async (bot, Guild, Help, User, Channel) => {
    if(Help.usage.length < 1) Help.usage = "No Usage Provided."
    if(Help.description.length < 1) Help.description = "No Description Provided"
    if(!Help.aliases[0]) Help.aliases = "No aliases"
    
    Channel.send({ embeds: [exports.EmbedGenerator(bot, config.GeneralEmbeds.InsufficientUsage, [`{Command}:${Help.name}`, `{Description}:${Help.description}`, `{Usage}:${Help.usage}`, `{Aliases}:${Help.aliases}`], User)] })
}

module.exports.CommandInfo = async (bot, Guild, Help, User, Channel) => {
    if(Help.usage.length < 1) Help.usage = "No Usage Provided."
    if(Help.description.length < 1) Help.description = "No Description Provided"
    if(!Help.aliases[0]) Help.aliases = "No aliases"
    
    let Permissions = []

    for(Permission of Help.permissions) {
        
        let RoleCheck = await Guild.roles.cache.find(role => role.id === Permission)
        if(RoleCheck) {
            Permissions.push(RoleCheck.toString())
            continue;
        }

        let MemberCheck = await Guild.members.cache.get(Permission)
        if(MemberCheck) {
            Permissions.push(MemberCheck.toString())
            continue;
        }
        Permissions.push(Permission)
    }

    Channel.send({ embeds: [exports.EmbedGenerator(bot, config.GeneralEmbeds.CommandInfo, [`{Command}:${Help.name}`, `{Description}:${Help.description}`, `{Usage}:${Help.usage}`, `{Aliases}:${Help.aliases}`, `{Permissions}:${Permissions}`], User)] })
}
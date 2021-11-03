const config = require('../../Configuration/YML').getConfiguration();
const functions = require('../../Utility/Functions')

module.exports.run = async (bot, message, args) => {
    let KickedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!KickedMember) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)
    
    if(KickedMember.roles.highest.rawPosition >= message.member.roles.highest.rawPosition && message.author.id != message.guild.ownerId) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}:${KickedMember.toString()} Has a higher or equal role to you.`], message.author)] })

    let NumberOfMessages = args[0]
    if(!NumberOfMessages) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    if(!functions.isNumeric(NumberOfMessages)) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)
    if(NumberOfMessages > 100 || NumberOfMessages < 2) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    
}

const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
module.exports.help = {
    name: CommandHelp.ModerationCommands.Purge.name,
    description: CommandHelp.ModerationCommands.Purge.description,
    usage: CommandHelp.ModerationCommands.Purge.usage,
    aliases: CommandHelp.ModerationCommands.Purge.aliases,
    permissions: CommandHelp.ModerationCommands.Purge.permissions,
    cooldown: CommandHelp.ModerationCommands.Purge.cooldown,
    enabled: CommandHelp.ModerationCommands.Purge.enabled
}
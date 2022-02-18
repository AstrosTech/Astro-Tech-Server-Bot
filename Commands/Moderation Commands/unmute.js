const config = require('../../Configuration/YML').getConfiguration();
const functions = require('../../Utility/Functions')
let MuteDatabase = require('../../Database/Models/MuteModel')

module.exports.run = async (bot, message, args) => {
    let MuteMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!MuteMember) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    let MuteCheck = await MuteDatabase.findOne({ UserID: MuteMember.id, Active: true })
    if(!MuteCheck) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}---${MuteMember.toString()} is not muted.`], message.author)] })

    let MuteRole = message.guild.roles.cache.find(role => role.id == config.MutedRoleID)
    if(!MuteRole) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}---MutedRoleID is not set correctly in the configuration.`], message.author)] })
    
    MuteMember.roles.remove(config.MutedRoleID)
    MuteCheck.Active = false
    MuteCheck.save()
}

const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
module.exports.help = {
    name: CommandHelp.ModerationCommands.UnMute.name,
    description: CommandHelp.ModerationCommands.UnMute.description,
    usage: CommandHelp.ModerationCommands.UnMute.usage,
    aliases: CommandHelp.ModerationCommands.UnMute.aliases,
    permissions: CommandHelp.ModerationCommands.UnMute.permissions,
    cooldown: CommandHelp.ModerationCommands.UnMute.cooldown,
    enabled: CommandHelp.ModerationCommands.UnMute.enabled
}
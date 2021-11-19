const config = require('../../Configuration/YML').getConfiguration();
const functions = require('../../Utility/Functions')
let TicketBanDatabase = require('../../Database/Models/TicketBanModel')

module.exports.run = async (bot, message, args) => {
    
    let BannedUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.mentions.roles.first() || message.guild.roles.cache.find(role => role.id === args[0])
    if(!BannedUser) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    let AlreadyBanCheck = await TicketBanDatabase.findOne({ UserID: BannedUser.user.id, Active: true })
    if(!AlreadyBanCheck) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}---${BannedUser.toString()} is not ticket banned!`], message.author)] })

    AlreadyBanCheck.Active = false
    await AlreadyBanCheck.save()
    
    message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.TicketEmbeds.SuccessfulTicketUnBan, [`{TicketUnBanned}---${BannedUser.toString()}`, `{UnBannedBy}---${message.member.toString()}`], message.author)] })
}

const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
module.exports.help = {
    name: CommandHelp.TicketCommands.TicketUnban.name,
    description: CommandHelp.TicketCommands.TicketUnban.description,
    usage: CommandHelp.TicketCommands.TicketUnban.usage,
    aliases: CommandHelp.TicketCommands.TicketUnban.aliases,
    permissions: CommandHelp.TicketCommands.TicketUnban.permissions,
    cooldown: CommandHelp.TicketCommands.TicketUnban.cooldown,
    enabled: CommandHelp.TicketCommands.TicketUnban.enabled
}
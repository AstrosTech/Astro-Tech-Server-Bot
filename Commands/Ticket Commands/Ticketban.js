const config = require('../../Configuration/YML').getConfiguration();
const functions = require('../../Utility/Functions')
let TicketBanDatabase = require('../../Database/Models/TicketBanModel')

module.exports.run = async (bot, message, args) => {
    
    let BannedUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.mentions.roles.first() || message.guild.roles.cache.find(role => role.id === args[0])
    if(!BannedUser) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    let AlreadyBanCheck = await TicketBanDatabase.findOne({ UserID: BannedUser.user.id, Active: true })
    if(AlreadyBanCheck) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}:${BannedUser.toString()} is already Ticket Banned!`], message.author)] })


    const TicketBanUser = new TicketBanDatabase({ UserID: BannedUser.user.id, BannedByID: message.author.id })
    await TicketBanUser.save()

    message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.TicketEmbeds.SuccessfulTicketBan, [`{TicketBanned}:${BannedUser.toString()}`, `{BannedBy}:${message.member.toString()}`], message.author)] })
}

const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
module.exports.help = {
    name: CommandHelp.TicketCommands.Ticketban.name,
    description: CommandHelp.TicketCommands.Ticketban.description,
    usage: CommandHelp.TicketCommands.Ticketban.usage,
    aliases: CommandHelp.TicketCommands.Ticketban.aliases,
    permissions: CommandHelp.TicketCommands.Ticketban.permissions,
    cooldown: CommandHelp.TicketCommands.Ticketban.cooldown,
    enabled: CommandHelp.TicketCommands.Ticketban.enabled
}
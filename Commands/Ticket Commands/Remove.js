const config = require('../../Configuration/YML').getConfiguration();
const functions = require('../../Utility/Functions')

module.exports.run = async (bot, message, args) => {
    let Channel = message.mentions.channels.first() || message.guild.channels.cache.find(channel => channel.id === args[0]) || message.channel
    if(!Channel.name.startsWith("ticket")) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.TicketEmbeds.NotATicketChannel, [`{Command}---${exports.help.name}`, `{Channel}---${Channel}`], message.author)] })


    let Removed = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.mentions.roles.first() || message.guild.roles.cache.find(role => role.id === args[0]) || message.guild.members.cache.get(args[1]) || message.guild.roles.cache.find(role => role.id === args[1])
    if(!Removed) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    await Channel.permissionOverwrites.edit(Removed, { VIEW_CHANNEL: false });

    Channel.send({ embeds: [functions.EmbedGenerator(bot, config.TicketEmbeds.SuccessfullyRemoved, [`{TicketChannel}---${message.channel.toString()}`, `{Removed}---${Removed.toString()}`], message.author)] })
}

const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
module.exports.help = {
    name: CommandHelp.TicketCommands.Remove.name,
    description: CommandHelp.TicketCommands.Remove.description,
    usage: CommandHelp.TicketCommands.Remove.usage,
    aliases: CommandHelp.TicketCommands.Remove.aliases,
    permissions: CommandHelp.TicketCommands.Remove.permissions,
    cooldown: CommandHelp.TicketCommands.Remove.cooldown,
    enabled: CommandHelp.TicketCommands.Remove.enabled
}
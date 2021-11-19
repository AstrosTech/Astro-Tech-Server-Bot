const config = require('../../Configuration/YML').getConfiguration();
const functions = require('../../Utility/Functions')

module.exports.run = async (bot, message, args) => {
    let Channel = message.mentions.channels.first() || message.guild.channels.cache.find(channel => channel.id === args[0]) || message.channel
    if(!Channel.name.startsWith("ticket")) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.TicketEmbeds.NotATicketChannel, [`{Command}---${exports.help.name}`, `{Channel}---${Channel}`], message.author)] })


    let Added = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.mentions.roles.first() || message.guild.roles.cache.find(role => role.id === args[0]) || message.guild.members.cache.get(args[1]) || message.guild.roles.cache.find(role => role.id === args[1])
    if(!Added) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    await Channel.permissionOverwrites.edit(Added, { VIEW_CHANNEL: true });

    Channel.send({ embeds: [functions.EmbedGenerator(bot, config.TicketEmbeds.SuccessfullyAdded, [`{TicketChannel}---${Channel.toString()}`, `{Added}---${Added.toString()}`], message.author)] })
}

const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
module.exports.help = {
    name: CommandHelp.TicketCommands.Add.name,
    description: CommandHelp.TicketCommands.Add.description,
    usage: CommandHelp.TicketCommands.Add.usage,
    aliases: CommandHelp.TicketCommands.Add.aliases,
    permissions: CommandHelp.TicketCommands.Add.permissions,
    cooldown: CommandHelp.TicketCommands.Add.cooldown,
    enabled: CommandHelp.TicketCommands.Add.enabled
}
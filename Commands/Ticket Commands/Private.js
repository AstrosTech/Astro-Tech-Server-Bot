const config = require('../../Configuration/YML').LoadConfiguration();
const functions = require('../../Utility/Functions')

module.exports.run = async (bot, message, args) => {
    if(!message.channel.name.startsWith("ticket")) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.TicketEmbeds.NotATicketChannel, [`{Command}:${exports.help.name}`], message.author)] })

    let ChannelPermissions = [...message.channel.permissionOverwrites.cache.values()]
    for(Permission of ChannelPermissions) {
        if(Permission.type != 'role') continue
        await message.channel.permissionOverwrites.edit(Permission.id, { VIEW_CHANNEL: false });
    }

    message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.TicketEmbeds.PrivatizedTicket, [`{TicketChannel}:${message.channel.toString()}`], message.author)] })
}


const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
module.exports.help = {
    name: CommandHelp.TicketCommands.Private.name,
    description: CommandHelp.TicketCommands.Private.description,
    usage: CommandHelp.TicketCommands.Private.usage,
    aliases: CommandHelp.TicketCommands.Private.aliases,
    permissions: CommandHelp.TicketCommands.Private.permissions,
    cooldown: CommandHelp.TicketCommands.Private.cooldown,
    enabled: CommandHelp.TicketCommands.Private.enabled
}
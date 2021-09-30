const config = require('../../Configuration/YML').LoadConfiguration();
const functions = require('../../Utility/Functions')

module.exports.run = async (bot, message, args) => {
    if(!message.channel.name.startsWith("ticket")) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.TicketEmbeds.NotATicketChannel, [`{Command}:Close`], message.author)] })


    let NewName = args.slice(0).join(" ")
    if(!NewName) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    await message.channel.rename(`ticket-${NewName}`).catch(err => { console.error(err) })
}


const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
module.exports.help = {
    name: CommandHelp.TicketCommands.Rename.name,
    description: CommandHelp.TicketCommands.Rename.description,
    usage: CommandHelp.TicketCommands.Rename.usage,
    aliases: CommandHelp.TicketCommands.Rename.aliases,
    permissions: CommandHelp.TicketCommands.Rename.permissions,
    cooldown: CommandHelp.TicketCommands.Rename.cooldown,
    enabled: CommandHelp.TicketCommands.Rename.enabled
}
const functions = require('../../Utility/Functions')
const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();

module.exports.run = async (bot, message, args) => {
    
    require('../../Configuration/YML').LoadConfiguration()

    message.channel.send({ embeds: [functions.EmbedGenerator(bot, )] })
}


module.exports.help = {
    name: CommandHelp.UtilityCommands.Help.name,
    description: CommandHelp.UtilityCommands.Help.description,
    usage: CommandHelp.UtilityCommands.Help.usage,
    aliases: CommandHelp.UtilityCommands.Help.aliases,
    permissions: CommandHelp.UtilityCommands.Help.permissions,
    cooldown: CommandHelp.UtilityCommands.Help.cooldown,
    enabled: CommandHelp.UtilityCommands.Help.enabled
}
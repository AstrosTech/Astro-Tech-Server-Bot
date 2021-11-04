const functions = require('../../Utility/Functions')
const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();

module.exports.run = async (bot, message, args) => {
    
    require('../../Configuration/YML').LoadConfiguration()

    message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.ConfigReload, null, message.author)] }).catch(err => { return })
}


module.exports.help = {
    name: CommandHelp.UtilityCommands.Reload.name,
    description: CommandHelp.UtilityCommands.Reload.description,
    usage: CommandHelp.UtilityCommands.Reload.usage,
    aliases: CommandHelp.UtilityCommands.Reload.aliases,
    permissions: CommandHelp.UtilityCommands.Reload.permissions,
    cooldown: CommandHelp.UtilityCommands.Reload.cooldown,
    enabled: CommandHelp.UtilityCommands.Reload.enabled
}
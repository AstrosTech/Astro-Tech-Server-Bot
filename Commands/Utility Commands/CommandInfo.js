const config = require('../../Configuration/YML').LoadConfiguration();
const functions = require('../../Utility/Functions')
const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
    
    let SuppliedCommand = args[0]
    if(!SuppliedCommand) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    let Command = bot.commands.get(SuppliedCommand) || bot.commands.get(bot.aliases.get(SuppliedCommand))
    if(!Command) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}:Invalid Command Provided`], message.author)]})

    return functions.CommandInfo(bot, message.guild, Command.help, message.author, message.channel)
}


module.exports.help = {
    name: CommandHelp.UtilityCommands.CommandInfo.name,
    description: CommandHelp.UtilityCommands.CommandInfo.description,
    usage: CommandHelp.UtilityCommands.CommandInfo.usage,
    aliases: CommandHelp.UtilityCommands.CommandInfo.aliases,
    permissions: CommandHelp.UtilityCommands.CommandInfo.permissions,
    cooldown: CommandHelp.UtilityCommands.CommandInfo.cooldown,
    enabled: CommandHelp.UtilityCommands.CommandInfo.enabled
}
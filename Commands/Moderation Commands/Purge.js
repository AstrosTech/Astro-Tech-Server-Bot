const config = require('../../Configuration/YML').getConfiguration();
const functions = require('../../Utility/Functions')

module.exports.run = async (bot, message, args) => {
    let NumberOfMessages = args[0]
    if(!NumberOfMessages) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    if(isNaN(NumberOfMessages)) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)
    if(NumberOfMessages > 100 || NumberOfMessages < 2) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    await message.channel.bulkDelete(NumberOfMessages).catch(err => { return })

    let CompleteMessage = await message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.ModerationEmbeds.SuccessfulPurge, [`{NumberOfMessages}---${NumberOfMessages}`], message.author)] })

    setTimeout(() => { CompleteMessage.delete().catch(err => { return } )}, 5000);
}

const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
module.exports.help = {
    name: CommandHelp.ModerationCommands.Purge.name,
    description: CommandHelp.ModerationCommands.Purge.description,
    usage: CommandHelp.ModerationCommands.Purge.usage,
    aliases: CommandHelp.ModerationCommands.Purge.aliases,
    permissions: CommandHelp.ModerationCommands.Purge.permissions,
    cooldown: CommandHelp.ModerationCommands.Purge.cooldown,
    enabled: CommandHelp.ModerationCommands.Purge.enabled
}
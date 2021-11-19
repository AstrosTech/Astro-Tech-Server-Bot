const Discord = require('discord.js')
const functions = require('../../Utility/Functions')
const config = require('../../Configuration/YML').getConfiguration();
const SuggestionDatabase = require('../../Database/Models/SuggestionsModel')

module.exports.run = async (bot, message, args) => {
    if(config.SuggestionCreateChannel.Enabled && message.channel.id != config.SuggestionCreateChannel.SuggestChannelID) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.SuggestionEmbeds.OnlySuggestionChannel, [`{PendingChannel}---${message.guild.channels.cache.find(channel => channel.id == config.SuggestionChannelIDS.Pending).toString()}`], message.author)] })
    let Category = args[0]
    if(!Category) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    let Suggestion = args.slice(1).join(" ")
    if(!Suggestion) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    
    if(!config.SuggestionCategories.some(Categories => Categories.toLowerCase() == Category.toLowerCase())) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.SuggestionEmbeds.InvalidCategory, [`{Categories}---${config.SuggestionCategories.join("\n")}`])] })

    let PendingChannel = message.guild.channels.cache.find(channel => channel.id == config.SuggestionChannelIDS.Pending)
    if(!PendingChannel) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}---Pending Channel set incorrectly in the configuration`], message.author)] })

    let SuggestionMessage = await PendingChannel.send({ embeds: [functions.EmbedGenerator(bot, config.SuggestionEmbeds.PendingSuggestion, [`{Suggestion}---${Suggestion}`, `{Category}---${Category.toUpperCase()}`], message.author)] })
    

    await SuggestionMessage.react('👍')
    await SuggestionMessage.react('👎')

    const NewSuggestion = new SuggestionDatabase({ UserID: message.author.id, MessageID: SuggestionMessage.id, Suggestion: Suggestion, Category: Category })
    await NewSuggestion.save()

    await message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.SuggestionEmbeds.SuccessfulSuggestion, [`{Suggestion}---${Suggestion}`, `{PendingChannel}---${PendingChannel.toString()}`])]})
}

const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
module.exports.help = {
    name: CommandHelp.SuggestionCommands.Suggest.name,
    description: CommandHelp.SuggestionCommands.Suggest.description,
    usage: CommandHelp.SuggestionCommands.Suggest.usage,
    aliases: CommandHelp.SuggestionCommands.Suggest.aliases,
    permissions: CommandHelp.SuggestionCommands.Suggest.permissions,
    cooldown: CommandHelp.SuggestionCommands.Suggest.cooldown,
    enabled: CommandHelp.SuggestionCommands.Suggest.enabled
}


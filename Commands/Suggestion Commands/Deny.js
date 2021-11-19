const Discord = require('discord.js')
const functions = require('../../Utility/Functions')
const config = require('../../Configuration/YML').getConfiguration();
const SuggestionDatabase = require('../../Database/Models/SuggestionsModel')

module.exports.run = async (bot, message, args) => {

    let SuggestionID = args[0]
    if(!SuggestionID) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    let Reason = args.slice(1).join(" ")
    if(!Reason) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    let PendingChannel = message.guild.channels.cache.find(channel => channel.id == config.SuggestionChannelIDS.Pending)
    if(!PendingChannel) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}---Pending Channel set incorrectly in the configuration`], message.author)] })

    let DeniedChannel = message.guild.channels.cache.find(channel => channel.id == config.SuggestionChannelIDS.Denied)
    if(!DeniedChannel) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}---Denied Channel set incorrectly in the configuration`], message.author)] })

    let Suggestion = await SuggestionDatabase.findOne({ MessageID: SuggestionID, Active: true })
    if(!Suggestion) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.SuggestionEmbeds.InvalidSuggestionID, [`{SuggestionID}---${SuggestionID}`], message.author)]})

    let SuggestionMessage = await PendingChannel.messages.fetch(SuggestionID).catch(err => { message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}---The Suggestion Message is no longer ${PendingChannel.toString()}. Cannot Deny Suggestion`], message.author)] })})
    if(!SuggestionMessage) {
        Suggestion.Active = false;
        Suggestion.Status = 0;

        await Suggestion.save()
        return;
    } else {
        Suggestion.Active = false;
        Suggestion.Status = 3;

        await Suggestion.save();

        let Upvotes = await SuggestionMessage.reactions.resolve('👍').count
        let Downvotes = await SuggestionMessage.reactions.resolve('👎').count
        
        await DeniedChannel.send({ embeds: [ functions.EmbedGenerator(bot, config.SuggestionEmbeds.DeniedSuggestion, [`{Suggestion}---${Suggestion.Suggestion}`, `{Category}---${Suggestion.Category}`, `{Upvotes}---${Upvotes}`, `{Downvotes}---${Downvotes}`, `{SuggestorAvatarURL}--${SuggestionMessage.embeds[0].author.proxyIconURL}`, `{SuggestionAuthor}---${SuggestionMessage.embeds[0].author.name}`, `{Reason}---${Reason}`], message.author, SuggestionMessage.embeds[0].author.iconURL) ] })
        await message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.SuggestionEmbeds.SuccessfulDenied, [`{Suggestion}---${Suggestion}`, `{PendingChannel}---${PendingChannel.toString()}`, `{DeniedChannel}---${DeniedChannel.toString()}`], message.author)]})
    }
}

const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
module.exports.help = {
    name: CommandHelp.SuggestionCommands.Deny.name,
    description: CommandHelp.SuggestionCommands.Deny.description,
    usage: CommandHelp.SuggestionCommands.Deny.usage,
    aliases: CommandHelp.SuggestionCommands.Deny.aliases,
    permissions: CommandHelp.SuggestionCommands.Deny.permissions,
    cooldown: CommandHelp.SuggestionCommands.Deny.cooldown,
    enabled: CommandHelp.SuggestionCommands.Deny.enabled
}


const Discord = require('discord.js')
const functions = require('../../Utility/Functions')
const config = require('../../Configuration/YML').LoadConfiguration();
const SuggestionDatabase = require('../../Database/Models/SuggestionsModel')

module.exports.run = async (bot, message, args) => {

    let SuggestionID = args[0]
    if(!SuggestionID) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    let Reason = args.slice(1).join(" ")
    if(!Reason) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    let PendingChannel = message.guild.channels.cache.find(channel => channel.id == config.SuggestionChannelIDS.Pending)
    if(!PendingChannel) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}:Pending Channel set incorrectly in the configuration`], message.author)] })

    let ApproveChannel = message.guild.channels.cache.find(channel => channel.id == config.SuggestionChannelIDS.Approved)
    if(!ApproveChannel) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}:Approve Channel set incorrectly in the configuration`], message.author)] })

    let Suggestion = await SuggestionDatabase.findOne({ MessageID: SuggestionID, Active: true })
    if(!Suggestion) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.SuggestionEmbeds.InvalidSuggestionID, [`{SuggestionID}:${SuggestionID}`], message.author)]})

    let SuggestionMessage = await PendingChannel.messages.fetch(SuggestionID).catch(err => { message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}:The Suggestion Message is no longer ${PendingChannel.toString()}. Cannot Approve Suggestion`], message.author)] })})
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
        
        await ApproveChannel.send({ embeds: [ functions.EmbedGenerator(bot, config.SuggestionEmbeds.ApprovedSuggestion, [`{Suggestion}:${Suggestion.Suggestion}`, `{Category}:${Suggestion.Category}`, `{Upvotes}:${Upvotes}`, `{Downvotes}:${Downvotes}`, `{SuggestorAvatarURL}--${SuggestionMessage.embeds[0].author.proxyIconURL}`, `{SuggestionAuthor}:${SuggestionMessage.embeds[0].author.name}`, `{Reason}:${Reason}`], message.author, SuggestionMessage.embeds[0].author.iconURL) ] })
        await message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.SuggestionEmbeds.SuccessfulApproved, [`{Suggestion}:${Suggestion}`, `{PendingChannel}:${PendingChannel.toString()}`, `{ApprovedChannel}:${ApproveChannel.toString()}`], message.author)]})
    }
}

const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
module.exports.help = {
    name: CommandHelp.SuggestionCommands.Approve.name,
    description: CommandHelp.SuggestionCommands.Approve.description,
    usage: CommandHelp.SuggestionCommands.Approve.usage,
    aliases: CommandHelp.SuggestionCommands.Approve.aliases,
    permissions: CommandHelp.SuggestionCommands.Approve.permissions,
    cooldown: CommandHelp.SuggestionCommands.Approve.cooldown,
    enabled: CommandHelp.SuggestionCommands.Approve.enabled
}


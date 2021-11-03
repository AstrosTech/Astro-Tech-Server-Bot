const Discord = require('discord.js');
const config = require('../../Configuration/YML').getConfiguration();
const functions = require('../../Utility/Functions')

module.exports = bot => {
bot.on("messageCreate", async (message)  => {

        if(config.SuggestionCreateChannel.Enabled != true) return;
        if(message.channel.id != config.SuggestionCreateChannel.SuggestChannelID) return

        setTimeout(async () => { if(functions.getSuggestionMessageID() == message.id) return; await message.delete() }, 3000)
    })
}
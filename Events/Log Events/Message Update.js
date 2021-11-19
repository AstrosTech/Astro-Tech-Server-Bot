const config = require('../../Configuration/YML').getConfiguration()
const functions = require('../../Utility/Functions')

module.exports = bot => { 
    bot.on("messageUpdate", async (message, newMessage) => {
        if(newMessage.guild.id != config.GuildID) return;
        if(newMessage.author.bot) return;

        let LogsChannel = newMessage.guild.channels.cache.find(channel => channel.id == config.Logs.MessageUpdate.ChannelID)
        if(!LogsChannel) return functions.LogToConsole('Logs.MessageUpdate.ChannelID set incorrectly.')

        await LogsChannel.send({ embeds: [ functions.EmbedGenerator(bot, config.Logs.MessageUpdate.Embed, [`{Channel}---${newMessage.channel.toString()}`, `{OldMessage}---${message.content}`, `{NewMessage}---${newMessage.content}`, `{Link}}---https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id}`], newMessage.author)] })
    })
}
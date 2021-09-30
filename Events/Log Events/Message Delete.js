const config = require('../../Configuration/YML').LoadConfiguration()
const functions = require('../../Utility/Functions')

module.exports = bot => { 
    bot.on("messageDelete", async (messageDelete) => {
        if(messageDelete.guild.id != config.GuildID) return;
        if(messageDelete.author.bot) return;

        let LogsChannel = messageDelete.guild.channels.cache.find(channel => channel.id == config.Logs.MessageDelete.ChannelID)
        if(!LogsChannel) return functions.LogToConsole('Logs.MessageDelete.ChannelID set incorrectly.')

        await LogsChannel.send({ embeds: [ functions.EmbedGenerator(bot, config.Logs.MessageDelete.Embed, [`{Channel}:${messageDelete.channel.toString()}`, `{Content}:${messageDelete.content}`], messageDelete.author)] })
    })
}
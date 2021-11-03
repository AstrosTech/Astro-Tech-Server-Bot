const config = require('../../Configuration/YML').getConfiguration()
const functions = require('../../Utility/Functions')
const moment = require('moment-timezone')

module.exports = bot => { 
    bot.on("guildMemberAdd", async (member) => {
        if(member.guild.id != config.GuildID) return;

        let LogsChannel = member.guild.channels.cache.find(channel => channel.id == config.Logs.MemberJoin.ChannelID)
        if(!LogsChannel) return functions.LogToConsole('Logs.MemberJoin.ChannelID set incorrectly. ')

        await LogsChannel.send({ embeds: [ functions.EmbedGenerator(bot, config.Logs.MemberJoin.Embed, [`{CreatedAt}--${moment(member.user.createdAt).tz('America/New_York').format("dddd, MMMM Do, h:mm a")} EST`,], member.user)] })
    })
}
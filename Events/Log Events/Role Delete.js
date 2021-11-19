const config = require('../../Configuration/YML').getConfiguration()
const functions = require('../../Utility/Functions')

module.exports = bot => { 
    bot.on("roleDelete", async (role) => {
        if(role.guild.id != config.GuildID) return;

        let LogsChannel = role.guild.channels.cache.find(channel => channel.id == config.Logs.RoleDelete.ChannelID)
        if(!LogsChannel) return functions.LogToConsole('Logs.MessageUpdate.ChannelID set incorrectly.')
            
        await LogsChannel.send({ embeds: [ functions.EmbedGenerator(bot, config.Logs.RoleDelete.Embed, [`{RoleName}---${role.name}`, `{RoleID}---${role.id}`, `{RoleColor}---${role.color}`, `{RolePosition}---${role.rawPosition}`], null)] })
    })
}
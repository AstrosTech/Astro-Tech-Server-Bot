const config = require('../../Configuration/YML').getConfiguration()
const functions = require('../../Utility/Functions')

module.exports = bot => { 
    bot.on("roleCreate", async (role) => {
        if(role.guild.id != config.GuildID) return;

        let LogsChannel = role.guild.channels.cache.find(channel => channel.id == config.Logs.RoleCreate.ChannelID)
        if(!LogsChannel) return functions.LogToConsole('Logs.MessageUpdate.ChannelID set incorrectly.')
        
        setTimeout(async () => {
            let UpdatedRole = role.guild.roles.cache.find(r => r.id == role.id)
            
            await LogsChannel.send({ embeds: [ functions.EmbedGenerator(bot, config.Logs.RoleCreate.Embed, [`{RoleTag}:${UpdatedRole.toString()}`,`{RoleName}:${UpdatedRole.name}`, `{RoleID}:${role.id}`, `{RoleColor}:${UpdatedRole.color}`, `{RolePosition}:${UpdatedRole.rawPosition}`], null)] })
        }, 10000);
    })
}
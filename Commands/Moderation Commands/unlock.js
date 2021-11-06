const config = require('../../Configuration/YML').getConfiguration();
const functions = require('../../Utility/Functions')

module.exports.run = async (bot, message, args) => {
    if(!config.ChannelLockRoleIDS || config.ChannelLockRoleIDS.length < 1) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}:ChannelLockRoleIDS has no role IDS`])]})
    
    await message.delete()
    for(roleID of config.ChannelLockRoleIDS) {
        let FoundRole = message.guild.roles.cache.find(role => role.id === roleID);
        if(!FoundRole) continue;

        await message.channel.permissionOverwrites.edit(FoundRole, { SEND_MESSAGES: null }).catch(err => { return })
    }

    await message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.ModerationEmbeds.SucessfullyLocked, [`{Channel}:${message.channel.toString()}`], message.author)] })
}

const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
module.exports.help = {
    name: CommandHelp.ModerationCommands.UnLock.name,
    description: CommandHelp.ModerationCommands.UnLock.description,
    usage: CommandHelp.ModerationCommands.UnLock.usage,
    aliases: CommandHelp.ModerationCommands.UnLock.aliases,
    permissions: CommandHelp.ModerationCommands.UnLock.permissions,
    cooldown: CommandHelp.ModerationCommands.UnLock.cooldown,
    enabled: CommandHelp.ModerationCommands.UnLock.enabled
}
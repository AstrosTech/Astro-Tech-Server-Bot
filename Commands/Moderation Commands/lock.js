const config = require('../../Configuration/YML').getConfiguration();
const functions = require('../../Utility/Functions')

module.exports.run = async (bot, message, args) => {
    if(!config.ChannelLockRoleIDS || config.ChannelLockRoleIDS.length < 1) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}:ChannelLockRoleIDS has no role IDS`])]})
    
    await message.delete()
    for(roleID of config.ChannelLockRoleIDS) {
        let FoundRole = message.guild.roles.cache.find(role => role.id === roleID);
        if(!FoundRole) continue;

        await message.channel.permissionOverwrites.edit(FoundRole, { SEND_MESSAGES: false }).catch(err => { return })
    }

    await message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.ModerationEmbeds.SucessfullyLocked, [`{Channel}:${message.channel.toString()}`], message.author)] })
}

const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
module.exports.help = {
    name: CommandHelp.ModerationCommands.Lock.name,
    description: CommandHelp.ModerationCommands.Lock.description,
    usage: CommandHelp.ModerationCommands.Lock.usage,
    aliases: CommandHelp.ModerationCommands.Lock.aliases,
    permissions: CommandHelp.ModerationCommands.Lock.permissions,
    cooldown: CommandHelp.ModerationCommands.Lock.cooldown,
    enabled: CommandHelp.ModerationCommands.Lock.enabled
}
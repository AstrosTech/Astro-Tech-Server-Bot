const config = require('../../Configuration/YML').getConfiguration();
const functions = require('../../Utility/Functions')
let MuteDatabase = require('../../Database/Models/MuteModel')

module.exports.run = async (bot, message, args) => {
    let MuteMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!MuteMember) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    let MuteCheck = MuteDatabase.findOne({ UserID: MuteMember.id, Active: true})
    if(MuteCheck) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}---${MuteMember.toString()} is already muted.`], message.author)] })

    
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
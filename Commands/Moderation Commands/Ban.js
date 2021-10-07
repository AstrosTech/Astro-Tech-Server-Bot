const config = require('../../Configuration/YML').LoadConfiguration();
const functions = require('../../Utility/Functions')

module.exports.run = async (bot, message, args) => {
    let BannedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!BannedMember) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    if(BannedMember == message.member) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}:You may not ban yourself.`], message.author)] })
    
    if(!BannedMember.bannable) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}:${BannedMember.toString()} is not bannable.`], message.author)] })
    if(BannedMember.roles.highest.rawPosition >= message.member.roles.highest.rawPosition && message.author.id != message.guild.ownerId) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}:${BannedMember.toString()} Has a higher or equal role to you.`], message.author)] })

    let Reason = args.slice(1).join(' ');
    if(!Reason) Reason = "No Reason Provided."

    await BannedMember.ban({ reason: Reason }).catch(err => { console.log(err) })
    await message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.ModerationEmbeds.SuccessfulBan, [`{BannedMemberUsername}:${BannedMember.user.username}`, `{BannedMemberDiscriminantor}:${BannedMember.user.discriminator}`, `{BannedMemberID}:${BannedMember.user.id}`], message.author)] })
}

const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
module.exports.help = {
    name: CommandHelp.ModerationCommands.Ban.name,
    description: CommandHelp.ModerationCommands.Ban.description,
    usage: CommandHelp.ModerationCommands.Ban.usage,
    aliases: CommandHelp.ModerationCommands.Ban.aliases,
    permissions: CommandHelp.ModerationCommands.Ban.permissions,
    cooldown: CommandHelp.ModerationCommands.Ban.cooldown,
    enabled: CommandHelp.ModerationCommands.Ban.enabled
}
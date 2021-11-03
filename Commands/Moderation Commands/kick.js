const config = require('../../Configuration/YML').getConfiguration();
const functions = require('../../Utility/Functions')

module.exports.run = async (bot, message, args) => {
    let KickedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!KickedMember) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    if(KickedMember == message.member) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}:You may not ban yourself.`], message.author)] })
    
    if(!KickedMember.kickable) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}:${KickedMember.toString()} is not kickable.`], message.author)] })
    if(KickedMember.roles.highest.rawPosition >= message.member.roles.highest.rawPosition && message.author.id != message.guild.ownerId) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.Errors, [`{Error}:${KickedMember.toString()} Has a higher or equal role to you.`], message.author)] })

    let Reason = args.slice(1).join(' ');
    if(!Reason) Reason = "No Reason Provided."

    await KickedMember.kick({ reason: Reason }).catch(err => { console.log(err) })
    await message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.ModerationEmbeds.SuccessfulKick, [`{KickedMemberUsername}:${KickedMember.user.username}`, `{KickedMemberDiscriminantor}:${KickedMember.user.discriminator}`, `{KickedMemberID}:${KickedMember.user.id}`], message.author)] })
}

const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
module.exports.help = {
    name: CommandHelp.ModerationCommands.Kick.name,
    description: CommandHelp.ModerationCommands.Kick.description,
    usage: CommandHelp.ModerationCommands.Kick.usage,
    aliases: CommandHelp.ModerationCommands.Kick.aliases,
    permissions: CommandHelp.ModerationCommands.Kick.permissions,
    cooldown: CommandHelp.ModerationCommands.Kick.cooldown,
    enabled: CommandHelp.ModerationCommands.Kick.enabled
}
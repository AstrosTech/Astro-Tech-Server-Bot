const config = require('../../Configuration/YML').LoadConfiguration();
const functions = require('../../Utility/Functions')
const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
    
    let AnnouncementType = args[0]
    if(!AnnouncementType) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    let AcceptedTypes = ['embed', 'message']
    if(!AcceptedTypes.some(Type => Type == AnnouncementType.toLowerCase())) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    let Channel = message.mentions.channels.first() || message.guild.channels.cache.find(channel => channel.id === args[1])
    if(!Channel) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)

    if(AnnouncementType == 'embed') {
        let Questions = [
            `Please provide the title of the embed (The default config placeholders will work)`,
            `Please provide the Color`,
            `Please Provide the Description`,
            `Please Provide the footer`,
            `Please Provide an images (Send any text if none)`
        ];
        const QuestionFilter = collected => { collected.author.id === message.author.id};

        let EmbedInformation = {}

        for(let i = 0; i < Questions.length; i++) {
        
            await message.channel.send({ content: Questions[i] })
            let QuestionResponseAwait = await message.channel.awaitMessages({ QuestionFilter, max: 1, time: 60000 })

            let QuestionResponse = QuestionResponseAwait.first()
            if(!QuestionResponse) break ;

            if(i == 0) {
                EmbedInformation.Title = QuestionResponse.content
            }
            else if(i == 1) {
                EmbedInformation.Color = QuestionResponse.content
            }
            else if (i == 2) {
                EmbedInformation.Description = QuestionResponse.content
            }
            else if(i == 3) {
                EmbedInformation.Footer = QuestionResponse.content
            }
            else if(i == 4) {
                if(QuestionResponse.attachments.size > 0) {
                    let attachment = QuestionResponse.attachments.first()
                            if(attachment.attachment.endsWith("png") || attachment.attachment.endsWith("jpg")) { 
                                    EmbedInformation.Image = attachment.proxyURL
                            }
                    }
            }
        }

        await Channel.send({ embeds: [ functions.EmbedGenerator(bot, EmbedInformation, null, message.author, null) ] })
    }
    else {

    let Announcement = args.slice(2).join(" ")
    if(!Announcement) return functions.InsufficientUsage(bot, message.guild, exports.help, message.author, message.channel)
    
    await Channel.send({ content: Announcement })

    if(message.attachments.size > 0) {
        let attachment = message.attachments.first()
            if(attachment.attachment.endsWith("png") || attachment.attachment.endsWith("jpg")) { 
                    await Channel.send({ content: attachment.proxyURL })
            }
    }
    }
}


module.exports.help = {
    name: CommandHelp.UtilityCommands.Announce.name,
    description: CommandHelp.UtilityCommands.Announce.description,
    usage: CommandHelp.UtilityCommands.Announce.usage,
    aliases: CommandHelp.UtilityCommands.Announce.aliases,
    permissions: CommandHelp.UtilityCommands.Announce.permissions,
    cooldown: CommandHelp.UtilityCommands.Announce.cooldown,
    enabled: CommandHelp.UtilityCommands.Announce.enabled
}
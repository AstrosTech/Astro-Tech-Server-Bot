const config = require('../../Configuration/YML').LoadConfiguration();
const functions = require('../../Utility/Functions')
const TranscriptUtility = require('../../Utility/Transcript') 

module.exports.run = async (bot, message, args) => {
    if(!message.channel.name.startsWith("ticket")) return message.channel.send({ embeds: [functions.EmbedGenerator(bot, config.TicketEmbeds.NotATicketChannel, [`{Command}:${exports.help.name}`], message.author)] })

    let Reason = args.slice(0).join(" ")
    if(!Reason) Reason = "Reason Not Provided."

    let TicketLogChannel = message.guild.channels.cache.find(channel => channel.id === config.TicketLogChannelID)
    if(!TicketLogChannel) return functions.LogToConsole('Unable to close tickets. Ticket Log Channel set incorrectly.')


    let FetchedMessages = await message.channel.messages.fetch({ limit: 5 });
    let LastFiveMessages = [...FetchedMessages.values()].reverse()
    
    let TicketUserID = message.channel.topic.split("-")
    
    let TicketMember = message.guild.members.cache.get(TicketUserID[0])

    let TicketUserPing;
    let TicketUserDiscriminator;

    if(TicketMember) {
        TicketUserPing = TicketMember.toString()
        TicketUserDiscriminator = `${TicketMember.user.username}#${TicketMember.user.discriminator}`
    }
    else {
        TicketUserPing = "Left Discord"
        TicketUserDiscriminator = ``
    }
    
    await TranscriptUtility.Transcript(bot, message.channel)
    await TicketLogChannel.send({ embeds: [ functions.EmbedGenerator(bot, config.TicketEmbeds.ClosedTicket, [`{LastFiveMessages}:${LastFiveMessages.map(m => m.content.toString()).join("\n")}`, `{TicketChannel}:${message.channel.name}`, `{TicketCreatorPing}:${TicketUserPing}`, `{TicketUserTag}:${TicketUserDiscriminator}`, `{Reason}:${Reason}` ], message.author) ], files: [`Database/Transcripts/${message.channel.id}-Transcript.html`] })
    if(TicketMember) await TicketLogChannel.send({ embeds: [ functions.EmbedGenerator(bot, config.TicketEmbeds.ClosedTicket, [`{LastFiveMessages}:${LastFiveMessages.map(m => m.content.toString()).join("\n")}`, `{TicketChannel}:${message.channel.name}`, `{TicketCreatorPing}:${TicketUserPing}`, `{TicketUserTag}:${TicketUserDiscriminator}`, `{Reason}:${Reason}` ], message.author) ], files: [`Database/Transcripts/${message.channel.id}-Transcript.html`] })

    await message.channel.delete().catch(err => { return })
}


const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();

module.exports.help = {
    name: CommandHelp.TicketCommands.Close.name,
    description: CommandHelp.TicketCommands.Close.description,
    usage: CommandHelp.TicketCommands.Close.usage,
    aliases: CommandHelp.TicketCommands.Close.aliases,
    permissions: CommandHelp.TicketCommands.Close.permissions,
    cooldown: CommandHelp.TicketCommands.Close.cooldown,
    enabled: CommandHelp.TicketCommands.Close.enabled
}
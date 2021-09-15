const TranscriptUtility = require('../../Utility/Transcript') 

module.exports.run = async (bot, message, args) => {
    
    await TranscriptUtility.Transcript(bot, message.channel)
    console.log('0')
    message.channel.send({ files: [`Database/Transcripts/${message.channel.id}-Transcript.html`] })
}

module.exports.help = {
    name:"close",
    description: "Closes tickets",
    usage: "rename [reason]",
    aliases: [],
    enabled: true
}
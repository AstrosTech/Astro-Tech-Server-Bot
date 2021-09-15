const config = require('../../Configuration/YML').LoadConfiguration()

module.exports = bot => { 
bot.on("messageCreate", async message => {
    if(message.author.bot || message.channel.type === "dm") return;
    
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);


    if(!config.Prefix.some(prefix => message.content.startsWith(prefix))) return

    let commandfile = bot.commands.get(cmd.slice(1)) || bot.commands.get(bot.aliases.get(cmd.slice(1)))
    if(commandfile) commandfile.run(bot, message, args);
    })
}
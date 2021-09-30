const config = require('../../Configuration/YML').LoadConfiguration()
const functions = require('../../Utility/Functions')
const Duration = require('humanize-duration')

const CommandCoolDown = new Map();

module.exports = bot => { 
bot.on("messageCreate", async (message) => {
        if(message.author.bot || message.channel.type === "dm") return;
        
        let messageArray = message.content.split(" ");
        let cmd = messageArray[0].toLowerCase();
        let args = messageArray.slice(1);

        if(!config.Prefix.some(prefix => message.content.startsWith(prefix))) return

        if(config.BlockCommandsChannelIDS.some(Channel => Channel == message.channel.id)) return message.react('❌').catch(err => { return })

        let commandfile = bot.commands.get(cmd.slice(1)) || bot.commands.get(bot.aliases.get(cmd.slice(1)))
        if(!commandfile) return
        
        let Verified = await functions.VerifyPermissions(commandfile.help.permissions, message.member)
        if(!Verified) return functions.InsufficientPermissions(bot, message.guild, commandfile.help, message.author, message.channel)

        let UsersCooldown = CommandCoolDown.has(`${message.author.id}:${commandfile.help.name}`)
        if(UsersCooldown) return message.channel.send({ embeds: [ functions.EmbedGenerator(bot, config.GeneralEmbeds.OnCooldown, [`{Command}:${commandfile.help.name}`, `{Cooldown}:${Duration(CommandCoolDown.get(`${message.author.id}:${commandfile.help.name}`) - Date.now(), { units: ['h', 'm', 's'], round: true })}`])] })

        if(isNaN(commandfile.help.cooldown) || commandfile.help.cooldown < 500) return commandfile.run(bot, message, args);
        
        
        CommandCoolDown.set(`${message.author.id}:${commandfile.help.name}`, Date.now() + commandfile.help.cooldown);

        commandfile.run(bot, message, args);
        setTimeout(() => { CommandCoolDown.delete(`${message.author.id}:${commandfile.help.name}`); }, commandfile.help.cooldown)
    })
}
const fs = require('fs')

module.exports = bot => {
const load = dirs => {
        const commands = fs.readdirSync(`./Commands/${dirs}/`).filter(d => d.endsWith('.js'));
            for (const file of commands) {
                const props = require(`../Commands/${dirs}/${file}`)
                
                if(!props.help) return;
                if(props.help.enabled == false) continue

                bot.commands.set(props.help.name, props);
                if(props.help.aliases && props.help.aliases.length > 0) props.help.aliases.forEach(alias => { bot.aliases.set(alias, props.help.name) });
            }
        };
        
        const commandsDir = fs.readdirSync("./Commands");
        commandsDir.forEach(x => load(x));
}
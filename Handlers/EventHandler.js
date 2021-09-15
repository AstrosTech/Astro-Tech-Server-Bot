const fs = require('fs')

module.exports = bot => {
    bot.setMaxListeners(50)
    const load = dirs => {
    const events = fs.readdirSync(`./Events/${dirs}/`).filter(d => d.endsWith('.js'));
    const reqEvent = (event, dirs) => require(`../Events/${dirs}/${event}`)

    bot.on("ready", function() { for (const file of events) { reqEvent(file, dirs)(bot) };})
    }


    const eventsDir = fs.readdirSync('./Events/');
    eventsDir.forEach(x => load(x));
}
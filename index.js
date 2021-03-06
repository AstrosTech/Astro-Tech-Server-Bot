
const Discord = require('discord.js');
require('./Configuration/YML').LoadConfiguration()
require('dotenv').config()

const functions = require('./Utility/Functions')
const bot = new Discord.Client({
        intents: ["GUILDS","GUILD_MEMBERS","GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES"]
});

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

// Loading Handlers //
require("./Handlers/EventHandler")(bot)
require("./Handlers/LoadCommands")(bot)
require("./Database/Connect")

bot.once("ready", async () => { functions.Start(bot) })
bot.login(process.env.Token)


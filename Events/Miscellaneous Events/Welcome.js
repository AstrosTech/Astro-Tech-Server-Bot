const Discord = require('discord.js');
const config = require('../../Configuration/YML').getConfiguration();
const functions = require('../../Utility/Functions')
const WelcomeUtility = require('../../Utility/WelcomeUtility')

module.exports = bot => { 
bot.on("guildMemberAdd", async (member)  => {

        if(member.guild.id != config.GuildID) return;

        if(config.WelcomeEnabled != true) return;

        let WelcomeChannel = member.guild.channels.cache.find(channel => channel.id == config.WelcomeChannelID)
        if(!WelcomeChannel) return functions.LogToConsole("WelcomeChannelID set incorrectly. Cannot welcome anyone.")


        if(config.WelcomeEmbedEnabled == true) return WelcomeChannel.send({ embeds: [functions.EmbedGenerator(bot, config.WelcomeEmbed, null, member.user)] })

        await WelcomeUtility.SendWelcomeImage(WelcomeChannel, member)


        //TODO: Make Mutes Persist
    })
}

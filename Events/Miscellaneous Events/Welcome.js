const Discord = require('discord.js');
const config = require('../../Configuration/YML').getConfiguration();
const functions = require('../../Utility/Functions')
const WelcomeUtility = require('../../Utility/WelcomeUtility')
const Mutes = require('../../Database/Models/MuteModel')

module.exports = bot => { 
bot.on("guildMemberAdd", async (member)  => {
        if(member.guild.id != config.GuildID) return;


        let Muted = await Mutes.findOne({ UserID: member.user.id, Active: true })
        if(Muted) member.roles.add(config.MutedRoleID)
        
        if(config.WelcomeEnabled != true) return;
        let WelcomeChannel = member.guild.channels.cache.find(channel => channel.id == config.WelcomeChannelID)
        if(!WelcomeChannel) return functions.LogToConsole("WelcomeChannelID set incorrectly. Cannot welcome anyone.")

        if(config.WelcomeEmbedEnabled == true) return WelcomeChannel.send({ embeds: [functions.EmbedGenerator(bot, config.WelcomeEmbed, null, member.user)] })
        await WelcomeUtility.SendWelcomeImage(WelcomeChannel, member)
    })
}

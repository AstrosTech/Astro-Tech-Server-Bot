const Discord = require('discord.js');
const config = require('../../Configuration/YML').LoadConfiguration();
const functions = require('../../Utility/Functions');
const VerificationUtility = require('../../Utility/VerificationUtility')

module.exports = bot => { 
    bot.on("interactionCreate", async (interaction)  => {
        if(config.VerificationEnabled != true) return;
        if(!interaction.isButton()) return;
        if(interaction.customId != "VerificationButton") return;
        
        if(config.VerificationRequireCaptcha != false) return VerificationUtility.SendCaptcha(bot, interaction)

        for(RoleID of config.VerifiedRoleIDS) {
            let VerifiedRole = bot.guilds.cache.get(config.GuildID).roles.cache.find(role => role.id == RoleID)
            if(VerifiedRole) await interaction.member.roles.add(VerifiedRole.id).catch(err => { return })
        }

        await interaction.reply({ embeds: [functions.EmbedGenerator(bot, config.VerificationEmbeds.NoCaptchaVerified, null, interaction.user)], ephemeral: true})
    })
}
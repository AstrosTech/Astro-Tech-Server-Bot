const config = require("../Configuration/YML").LoadConfiguration();
const { CaptchaGenerator } = require('captcha-canvas');
const functions = require("./Functions")
const fs = require('fs');

module.exports.CreateCaptcha = async () => {
const options = { height: 200, width: 600 };
const captcha = new CaptchaGenerator(options); 

captcha.setDecoy()
captcha.setTrace()

let CaptchaText = captcha.text;
const buffer = await captcha.generate();

let CaptchaImage = fs.writeFileSync('./Database/Captchas/Captcha.png', buffer);

return {CaptchaImage, CaptchaText}
}

module.exports.SendCaptcha = async (bot, interaction) => {

    let Captcha = await exports.CreateCaptcha()

    try{
        let CaptchaMessage = await interaction.user.send({ files: ['./Database/Captchas/Captcha.png']})
        await interaction.reply({ embeds: [functions.EmbedGenerator(bot, config.VerificationEmbeds.CreatedVerificationCaptcha, null, interaction.user)], ephemeral: true})

        const QuestionFilter = collected => collected.author.id === interaction.user.id;
        let CaptchaAwaitResponse = await CaptchaMessage.channel.awaitMessages({ QuestionFilter, max: 1, time: config.VerificationTimeoutTime })

        if(CaptchaAwaitResponse.first() == undefined) return interaction.user.send({ embeds: [functions.EmbedGenerator(bot, config.VerificationEmbeds.CaptchaTimeout, null, interaction.user)] })

        if(CaptchaAwaitResponse.first().content.toLowerCase() != Captcha.CaptchaText.toLowerCase()) return interaction.user.send({ embeds: [functions.EmbedGenerator(bot, config.VerificationEmbeds.CaptchaFail, null, interaction.user)] })

        await interaction.user.send({ embeds: [functions.EmbedGenerator(bot, config.VerificationEmbeds.CaptchaSuccess, null, interaction.user)] })

        for(RoleID of config.VerifiedRoleIDS) {
            let VerifiedRole = bot.guilds.cache.get(config.GuildID).roles.cache.find(role => role.id == RoleID)
            if(VerifiedRole) await interaction.member.roles.add(VerifiedRole).catch(err => { return })
        }
    } catch(err) {
        interaction.reply({ embeds: [ functions.EmbedGenerator(bot, config.VerificationEmbeds.DmsClosed, null, interaction.user)], ephemeral: true })
    }
}
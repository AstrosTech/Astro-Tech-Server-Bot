const Discord = require('discord.js');
const config = require('../../Configuration/YML').LoadConfiguration();
const functions = require('../../Utility/Functions')
const TicketUtility = require('../../Utility/TicketUtility')

module.exports = bot => { 
bot.on("interactionCreate", async (interaction)  => {
        if(!interaction.isButton()) return;
        if(interaction.customId != "TicketButton") return;
        
        let TicketChannel = await TicketUtility.CreateTicketChannel(bot, interaction);
        if(!TicketChannel) return;

        await interaction.reply({ embeds: [functions.EmbedGenerator(bot, config.TicketEmbeds.TicketCreatedReply, [`{TicketChannel}:${TicketChannel.toString()}`])], ephemeral: true });
        
        let TicketCategory = await TicketUtility.TicketCategorySelection(bot, TicketChannel, interaction.user);
        if(!TicketCategory) return

        let AutomatedQuestionResponses = await TicketUtility.AutomatedTicketQuestions(bot, config.TicketCategories[TicketCategory], TicketChannel, interaction.user)

        const [FirstDescription, ...RestDescription] = Discord.Util.splitMessage(AutomatedQuestionResponses.UserResponses.join("\n"), { maxLength: 4000, char: "\n" })
        await TicketChannel.send({ embeds: [functions.EmbedGenerator(bot, config.TicketEmbeds.FinalTicketEmbed, [`{AutomatedQuestions}:${FirstDescription}`], interaction.user)] })

        for (let i = 0; i < RestDescription.length; i++) { await TicketChannel.send( { embeds: [functions.EmbedGenerator(bot, config.TicketEmbeds.TicketEmbedRunOff, [`{Count}:${i}`, `{Description}:${RestDescription[i]}`], interaction.user)] })}
        if(AutomatedQuestionResponses.UserImages.length > 0) await TicketChannel.send({ content: AutomatedQuestionResponses.UserImages })
    })
}

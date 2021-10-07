const Discord = require('discord.js');
const config = require('../../Configuration/YML').LoadConfiguration();
const functions = require('../../Utility/Functions')

module.exports = bot => { 
    bot.on("interactionCreate", async (interaction) => {
        if(!interaction.isButton()) return;

        let ReactRole = config.ReactRoles[interaction.customId]
        if(!ReactRole) return;
        
        let Role = interaction.guild.roles.cache.find(role => role.id == ReactRole.RoleID)
        if(!Role) return functions.LogToConsole(`${interaction.customId} RoleID (${ReactRole.RoleID}) is not a valid role. Skipping role...`)
        
        let MemberRoleCheck = interaction.member.roles.cache.find(roles => roles.id == Role.id)
        if(MemberRoleCheck) {
            await interaction.member.roles.remove(Role).catch(err => { console.error(err) })
            return await interaction.reply({ ephemeral: true, embeds: [ functions.EmbedGenerator(bot, config.ReactRoleEmbeds.RemovedRoles, [`{RemovedRole}:${Role.toString()}`, `{ButtonLabel}:${ReactRole.ButtonLabel}`], interaction.user)] })
        }
        
        await interaction.member.roles.add(Role).catch(err => { console.error(err) })
        return await interaction.reply({ ephemeral: true, embeds: [ functions.EmbedGenerator(bot, config.ReactRoleEmbeds.GivenRoles, [`{GivenRole}:${Role.toString()}`, `{ButtonLabel}:${ReactRole.ButtonLabel}`], interaction.user)] })
        
    })
}

const config = require('../../Configuration/YML').LoadConfiguration();
const functions = require('../../Utility/Functions')
const CommandHelp = require('../../Configuration/YML').LoadCommandConfiguration();
const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
    
    let row = new Discord.MessageActionRow()


    let DropDownMenu = new Discord.MessageSelectMenu()
    .setCustomId(`${message.author.id}-HelpMenu`)
    .setPlaceholder(config.TicketDropDownMenu.PlaceHolder)

    for(CommandCategory in CommandHelp) {
        let Category = CommandHelp[CommandCategory];

        DropDownMenu.addOptions([
            {
                label: Category.HelpDropDown.Label,
                description: Category.HelpDropDown.Description,
                value: CommandCategory,
                emoji: Category.HelpDropDown.Emoji
            }
        ])
    }

    row.addComponents(DropDownMenu)

    let MenuMessage = await message.channel.send({ embeds:[functions.EmbedGenerator(bot, config.GeneralEmbeds.FrontPageHelp, null, message.author)], components: [row] })

    let MenuFilter = (interaction) => { interaction.user.id === message.author.id; return row }

    let MenuResponse = await MenuMessage.createMessageComponentCollector({ MenuFilter, time: 180000, idle: 60000 })

    MenuResponse.on('collect', async (interaction) => {
        await interaction.deferUpdate();
        
        let SelectedCommands = interaction.values[0]

        let CommandDescriptions = `**__${SelectedCommands}__**\n`
        for(Commands in CommandHelp[SelectedCommands]) {
            if(Commands == 'HelpDropDown') continue

            let Command = CommandHelp[SelectedCommands][Commands]
            CommandDescriptions += `> **${message.content[0]}${Command.name}** • ${Command.description}\n`
        }
        
        await MenuMessage.edit({ embeds: [functions.EmbedGenerator(bot, config.GeneralEmbeds.HelpPages, [`{HelpInformation}:${CommandDescriptions}`], message.author)] })
    })
}


module.exports.help = {
    name: CommandHelp.UtilityCommands.Help.name,
    description: CommandHelp.UtilityCommands.Help.description,
    usage: CommandHelp.UtilityCommands.Help.usage,
    aliases: CommandHelp.UtilityCommands.Help.aliases,
    permissions: CommandHelp.UtilityCommands.Help.permissions,
    cooldown: CommandHelp.UtilityCommands.Help.cooldown,
    enabled: CommandHelp.UtilityCommands.Help.enabled
}
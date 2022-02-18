const config = require('../Configuration/YML').getConfiguration();
const Discord = require('discord.js');
const functions = require('./Functions')

module.exports.CreateTicketChannel = async (bot, interaction) => {
    let IncompleteTicket = interaction.guild.channels.cache.find(channel => channel.topic == interaction.user.id)
    if(IncompleteTicket) return exports.AlreadyHasTicket(bot, "Incomplete", IncompleteTicket.toString(), interaction)

    let TicketNumber = await exports.TicketCounter()
    let TicketChannel = await interaction.guild.channels.create("ticket-" + TicketNumber, {
        type: "GUILD_TEXT",
        topic: interaction.user.id,
        parent: config.IncompleteTickets.ParentID,
        permissionOverwrites: [
                {   
                    id: interaction.user.id,
                    allow: config.IncompleteTickets.AllowedPermissions,
                    deny: config.IncompleteTickets.DeniedPermissions
                },
                {
                    id: interaction.guild.id,
                    deny: ["VIEW_CHANNEL"],
                }
            ]
    })
    return TicketChannel
}

module.exports.AlreadyHasTicket = async (bot, Category, Channel, interaction, User, TicketChannel) => {
    if(!interaction && User && TicketChannel) {
        await User.send({ embeds: [ functions.EmbedGenerator(bot, config.TicketEmbeds.NoMoreCategories, null, User) ]}).catch(err => { return })

        await TicketChannel.delete().catch(err => { return })
        return
    }
    interaction.reply({ embeds: [ functions.EmbedGenerator(bot, config.TicketEmbeds.AlreadyHaveTicket, [`{TicketCategory}---${Category}`, `{TicketChannel}---${Channel.toString()}`]) ], ephemeral: true })
}

module.exports.TicketCounter = async () => {
    const fs = require('fs')

    const CounterDatabase = JSON.parse(fs.readFileSync("././Database/TicketCounter.json", "utf8"));
    if (!CounterDatabase["TicketID"]) CounterDatabase["TicketID"] = { TicketID: 0 }


    if(CounterDatabase["TicketID"].TicketID >= 9999) CounterDatabase["TicketID"] = { TicketID: 0 }

    CounterDatabase["TicketID"].TicketID++
    fs.writeFileSync("././Database/TicketCounter.json", JSON.stringify(CounterDatabase, null, "\t"));

    let s = "000" + CounterDatabase["TicketID"].TicketID;
    return s.substr(s.length-4);
}

module.exports.TicketCategorySelection = async (bot, TicketChannel, User) => {
    if(!TicketChannel) return
    let row = new Discord.MessageActionRow()

    let DropDownMenu = new Discord.MessageSelectMenu()
    .setCustomId(`${TicketChannel}-TicketCategorySelection`)
    .setPlaceholder(config.TicketDropDownMenu.PlaceHolder)
    
    let CategoriesLength = Object.keys(config.TicketCategories).length
    
    if(CategoriesLength == 0) return
    if(CategoriesLength == 1) return Object.keys(config.TicketCategories)[0]

    for (let i = 0; i < CategoriesLength; i++) {
        let TicketCategoryName = Object.keys(config.TicketCategories)[i];
        let TicketCategory = config.TicketCategories[TicketCategoryName];
        
        let AlreadyTicketCheck = TicketChannel.guild.channels.cache.find(channel => channel.topic === `${User.id}-${TicketCategory.ParentID}`)
        if(AlreadyTicketCheck) continue;

        DropDownMenu.addOptions([
            {
                label: TicketCategory.Name,
                description: TicketCategory.Description,
                value: TicketCategoryName,
                emoji: TicketCategory.Emoji
            }
        ])
    }

    if(DropDownMenu.options.length < 1) return exports.AlreadyHasTicket(bot, "All", TicketChannel, null, User, TicketChannel)

    row.addComponents(DropDownMenu)
    let MenuMessage = await TicketChannel.send({ embeds:[functions.EmbedGenerator(bot, config.TicketEmbeds.CategorySelectEmbed, null)], components: [row] })
    
    let MenuFilter = (interaction) => { interaction.user.id === TicketChannel.topic; return row }
    let MenuResponse = await MenuMessage.awaitMessageComponent({MenuFilter, max: 1, time: config.TicketDropDownMenu.Timeout}).catch(err => { return })
    if(!MenuResponse) return exports.TicketTimedOut(bot, User, TicketChannel)

    if(!config.TicketCategories[MenuResponse.values[0]].RequiredToOpenRoleIDs.some(role => bot.guilds.cache.get(config.GuildID).members.cache.find(member => member.id == User.id).roles.cache.find(roleid => roleid.id === role))) return exports.TicketCategoryNoPermission(bot, User, TicketChannel, config.TicketCategories[MenuResponse.values[0]].Name)

    await MenuResponse.reply({ embeds: [functions.EmbedGenerator(bot, config.TicketEmbeds.SelectedCategoryReply, [`{TicketCategory}---${config.TicketCategories[MenuResponse.values[0]].Name}`])] })

    await TicketChannel.permissionOverwrites.edit(User, { SEND_MESSAGES: true }).catch(err => { return });

    await TicketChannel.setTopic(`${User.id}-${config.TicketCategories[MenuResponse.values[0]].ParentID}`)
    await TicketChannel.setParent(config.TicketCategories[MenuResponse.values[0]].ParentID, { lockPermissions: false })
    return MenuResponse.values[0]
}

module.exports.TicketCategoryNoPermission = async (bot, User, TicketChannel, Category) => {
    await User.send({ embeds: [functions.EmbedGenerator(bot, config.TicketEmbeds.TicketCategoryNoPermission, [`{TicketCategory}---${Category}`], User)] }).catch(err => { return })
    await TicketChannel.delete().catch(err => { return; })
}

module.exports.AutomatedTicketQuestions = async (bot, TicketCategory, TicketChannel, User) => {
    let UserResponses = []
    let UserImages = []

    if(!TicketCategory || !TicketChannel) return
    for (let i = 0; i < TicketCategory.Questions.length; i++) {
        let TicketQuestion = TicketCategory.Questions[i]
        
        if(TicketQuestion.startsWith("Additional")) {
            let AdditionalName = TicketQuestion.split(":")[1]
            let SelectedAdditional = await exports.TicketAdditionalsCategorySelect(bot, AdditionalName, TicketChannel, User, TicketCategory)
            

            UserResponses.push(`**__${SelectedAdditional}__**`)
            let AdditionalResponses = await exports.TicketAdditionalsAutomatedQuestions(bot, config.TicketAdditionals[AdditionalName][SelectedAdditional], TicketChannel, User)
            UserResponses = UserResponses.concat(AdditionalResponses.UserResponses)

            if(AdditionalResponses.UserImages.length > 0) UserImages = UserImages.concat(AdditionalResponses.UserImages)
        }
        else {
            const QuestionFilter = collected => collected.author.id === User.id;

            await TicketChannel.send({ embeds: [functions.EmbedGenerator(bot, config.TicketEmbeds.AutomatedQuestionMessage, [`{Question}---${TicketQuestion}`])] })
            let QuestionResponseAwait = await TicketChannel.awaitMessages({ QuestionFilter, max: 1, time: config.TicketQuestionTimeout })

            let QuestionResponse = QuestionResponseAwait.first()
            if(!QuestionResponse) {
                exports.TicketTimedOut(bot, User, TicketChannel)
                break;
            }

            if(QuestionResponse.attachments.size > 0) {
            QuestionResponse.attachments.forEach(attachment => { 
                if(attachment.attachment.endsWith("png") || attachment.attachment.endsWith("jpg")) { 
                    QuestionResponse = `View Attached Files`; UserImages.push(attachment.proxyURL)
                    } else return QuestionResponse = `Attempted to send an attachment that was not a screenshot`
                })
            }

            UserResponses.push(`**${TicketQuestion}**\n\`\`\`${QuestionResponse}\`\`\``)
        }
    }
    
    let Staff = []
    for(StaffIDS of TicketCategory.StaffIDs) {
        let StaffRole = await bot.guilds.cache.get(config.GuildID).roles.cache.find(role => role.id == StaffIDS)
        if(!StaffRole) continue
        
        await TicketChannel.permissionOverwrites.edit(StaffRole, { VIEW_CHANNEL: true }).catch(err => { return });

        Staff.push(StaffRole.toString())
    }

    let StaffRolePing = await TicketChannel.send({ content: Staff.join(', ') });
    await StaffRolePing.delete().catch(err => { return; })
    return { UserResponses, UserImages }
}

module.exports.TicketTimedOut = async (bot, User, TicketChannel) => {
    let CreateTicketChannel = bot.guilds.cache.get(config.GuildID).channels.cache.find(channel => channel.id == config.TicketChannelID)
    await TicketChannel.delete().catch(err => { return })
    await User.send({ embeds: [functions.EmbedGenerator(bot, config.TicketEmbeds.TicketTimedOut, [`{CreateTicketChannel}---${CreateTicketChannel.toString()}`])] }).catch(err => { return })
    return
}

module.exports.TicketAdditionalsCategorySelect = async (bot, Additional, TicketChannel, User) => {

    if(!Additional || !TicketChannel) return

    let row = new Discord.MessageActionRow()
    await TicketChannel.permissionOverwrites.edit(User, { SEND_MESSAGES: false }).catch(err => { return });

    let DropDownMenu = new Discord.MessageSelectMenu()
    .setCustomId(`${TicketChannel.id}-Additional`)
    .setPlaceholder(config.TicketDropDownMenu.PlaceHolder)

    for (let i = 0; i < Object.keys(config.TicketAdditionals[Additional]).length; i++) {
        let AdditionalCategoryName = Object.keys(config.TicketAdditionals[Additional])[i]
        let AdditionalCategory = config.TicketAdditionals[Additional][AdditionalCategoryName]
        
        let AlreadyTicketCheck = TicketChannel.guild.channels.cache.find(channel => channel.topic === `${User.id}-${AdditionalCategory.ParentID}`)
        if(AlreadyTicketCheck) continue;
        
        DropDownMenu.addOptions([
            {
                label: AdditionalCategory.Name,
                description: AdditionalCategory.Description,
                value: AdditionalCategoryName,
                emoji: AdditionalCategory.Emoji
            }
        ])
    }

        if(DropDownMenu.options.length < 1) return exports.AlreadyHasTicket(bot, Additional.Name, TicketChannel, null, User, TicketChannel)
        
        row.addComponents(DropDownMenu)
        let MenuMessage = await TicketChannel.send({embeds:[functions.EmbedGenerator(bot, config.TicketEmbeds.CategorySelectEmbed, null)], components: [row]})

        let MenuFilter = (interaction) => { interaction.user.id === TicketChannel.topic; return row }

        let MenuResponse = await MenuMessage.awaitMessageComponent({ MenuFilter, max: 1, time: config.TicketDropDownMenu.Timeout }).catch(err => { return })
        if(!MenuResponse) return exports.TicketTimedOut(bot, User, TicketChannel)

        await MenuResponse.reply({ embeds: [functions.EmbedGenerator(bot, config.TicketEmbeds.SelectedCategoryReply, [`{TicketCategory}---${config.TicketAdditionals[Additional][MenuResponse.values[0]].Name}`])] })

        await TicketChannel.permissionOverwrites.edit(User, { SEND_MESSAGES: true }).catch(err => { return });

        if(config.TicketAdditionals[Additional][MenuResponse.values[0]].ParentID) await TicketChannel.setParent(config.TicketAdditionals[Additional][MenuResponse.values[0]].ParentID, { lockPermissions: false })
        return MenuResponse.values[0]
}

module.exports.TicketAdditionalsAutomatedQuestions = async (bot, TicketCategory, TicketChannel, User) => {
    let UserResponses = []
    let UserImages = []

    if(!TicketCategory || !TicketChannel) return

    for (let i = 0; i < TicketCategory.Questions.length; i++) {
        let TicketQuestion = TicketCategory.Questions[i]
        
        if(TicketQuestion.startsWith("Additional")) {
            let AdditionalName = TicketQuestion.split(":")[1]
            let SelectedAdditional = await exports.TicketAdditionalsCategorySelect(bot, AdditionalName, TicketChannel, User, TicketCategory)
            
            UserResponses.push(`**__${SelectedAdditional}__**`)
            let AdditionalResponses = await exports.TicketAdditionalsAutomatedQuestions(bot, config.TicketAdditionals[AdditionalName][SelectedAdditional], TicketChannel, User)
            UserResponses = UserResponses.concat(AdditionalResponses.UserResponses)

            if(AdditionalResponses.UserImages.length > 0) UserImages = UserImages.concat(AdditionalResponses.UserImages)
        }
        else {
            const QuestionFilter = collected => collected.author.id === User.id;

            await TicketChannel.send({ embeds: [functions.EmbedGenerator(bot, config.TicketEmbeds.AutomatedQuestionMessage, [`{Question}---${TicketQuestion}`])] })
            let QuestionResponseAwait = await TicketChannel.awaitMessages({ QuestionFilter, max: 1, time: config.TicketQuestionTimeout })

            let QuestionResponse = QuestionResponseAwait.first()
            if(!QuestionResponse) {
                exports.TicketTimedOut(bot, User, TicketChannel)
                break;
            }

            if(QuestionResponse.attachments.size > 0) {
            QuestionResponse.attachments.forEach(attachment => { 
                if(attachment.attachment.endsWith("png") || attachment.attachment.endsWith("jpg")) { 
                    QuestionResponse = `View Attached Files`; UserImages.push(attachment.proxyURL)
                    } else return QuestionResponse = `Attempted to send an attachment that was not a screenshot`
                })
            }

            UserResponses.push(`**${TicketQuestion}**\n\`\`\`${QuestionResponse}\`\`\``)

        }
    }
    return { UserResponses, UserImages }
}
const Discord = require('discord.js')
const functions = require('./Functions')
const fs = require('fs')
const moment = require('moment-timezone')

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM();
const document = dom.window.document;

module.exports.Transcript = async (bot, Channel) => {
    let MessageCollection = new Discord.Collection();
    let ChannelMessages = await Channel.messages.fetch({ limit: 100 }).catch(err => { console.log(err) })

    MessageCollection = MessageCollection.concat(ChannelMessages)

    while(ChannelMessages.size === 100) {
        let LastMessageID = ChannelMessages.lastKey()
        ChannelMessages = await Channel.messages.fetch({ limit: 100, before: LastMessageID }).catch(err => { console.log(err) })

        if(ChannelMessages) MessageCollection = MessageCollection.concat(ChannelMessages)
    }
    
    let Messages = [...MessageCollection.values()].reverse();
    let TranscriptTemplate = await fs.readFileSync('././Configuration/TicketTemplate.html')
    
    if(!TranscriptTemplate) return functions.LogToConsole("TicketTemplate.html cannot be found. Cannot transcript.")


    await fs.writeFileSync(`././Database/Transcripts/${Channel.id}-Transcript.html`, TranscriptTemplate)

    let GuildElement = document.createElement('div')
    let GuildText = document.createTextNode(Channel.guild.name)
    let GuildImage = document.createElement('img')

    GuildImage.setAttribute('src', Channel.guild.iconURL())
    GuildImage.setAttribute('width', '150')

    GuildElement.appendChild(GuildImage)
    GuildElement.appendChild(GuildText)

    await fs.appendFileSync(`././Database/Transcripts/${Channel.id}-Transcript.html`, GuildElement.outerHTML)
    
    for(msg of Messages) {
            let parentContainer = document.createElement("div");
                        parentContainer.className = "parent-container";

                        let avatarDiv = document.createElement("div");
                        avatarDiv.className = "avatar-container";
                        let img = document.createElement('img');
                        img.setAttribute('src', msg.author.displayAvatarURL());
                        img.className = "avatar";
                        avatarDiv.appendChild(img);

                        parentContainer.appendChild(avatarDiv);

                        let messageContainer = document.createElement('div');0
                        messageContainer.className = "message-container";

                        let nameElement = document.createElement("span");
                        let name = document.createTextNode(msg.author.tag + " " + moment(msg.createdAt).tz('America/New_York').format("dddd, MMMM Do, h:mm a") + " EST");
                        nameElement.appendChild(name);
                        messageContainer.append(nameElement);

                        if(msg.content.startsWith("```")) {
                            let m = msg.content.replace(/```/g, "");
                            let codeNode = document.createElement("code");
                            let textNode =  document.createTextNode(m);
                            codeNode.appendChild(textNode);
                            messageContainer.appendChild(codeNode);
                        }
                        
                        else if (msg.content == '') {
                        if(msg.embeds.length == 0) return
                        let m = msg.embeds[0].description
                        let EmbedDiv = document.createElement("div");
                        EmbedDiv.className = "embed-container";
                        let codeNode = document.createElement("code");
                        let textNode =  document.createTextNode(m);
                        codeNode.className = "card1";
                            codeNode.appendChild(textNode);
                            messageContainer.appendChild(codeNode)
                        }
                        

                        
                        else if (msg.attachments.size > 0) {
                        let avatarDiv = document.createElement("div");
                        avatarDiv.className = "avatar-container";
                        let img = document.createElement('img');
                        
                        let url;
                        msg.attachments.forEach(attachment => {
                            url = attachment.url
                        })


                        img.setAttribute('src', url);
                        img.className = "Images";
                        avatarDiv.appendChild(img);
                        }
                        else {
                            let msgNode = document.createElement('span');
                            let textNode = document.createTextNode(msg.content);
                            msgNode.append(textNode);
                            messageContainer.appendChild(msgNode);
                        }
                        
                        parentContainer.appendChild(messageContainer);
            await fs.appendFileSync(`././Database/Transcripts/${Channel.id}-Transcript.html`, parentContainer.outerHTML)
            };
}
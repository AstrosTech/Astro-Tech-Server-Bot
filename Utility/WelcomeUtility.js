const Discord = require('discord.js');
const Canvas = require('canvas')

module.exports.SendWelcomeImage = async (WelcomeChannel, member) => {
    const canvas = Canvas.createCanvas(700, 300);
	const ctx = canvas.getContext('2d');
	
	const fs = require('fs');

	let files = fs.readdirSync("./Configuration/Backgrounds")
    let chosenFile = files[Math.floor(Math.random() * files.length)] 
    
	const background = await Canvas.loadImage(`./Configuration/Backgrounds/${chosenFile}`);
	
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#181C19';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Slightly smaller text placed above the member's display name
        ctx.font = '36px Verdana';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = "center";
        ctx.fillText(`Welcome`, canvas.width / 2, canvas.height / 1.5);
    //member
        ctx.font = '30px Verdana';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = "center";
        ctx.fillText(`${member.user.username}#${member.user.discriminator} to the Discord!`, canvas.width / 2, canvas.height / 1.25);
    //member count
        ctx.font = '24px Verdana';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = "center";
        ctx.fillText(`Member #${member.guild.memberCount}`, canvas.width / 2, canvas.height / 1.1);
    //avatar
        ctx.beginPath();
        ctx.arc(350, 90, 65, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
        ctx.drawImage(avatar, 285, 25, 130, 130);

	    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
        WelcomeChannel.send({ files: [attachment] }).catch(err => { console.log(err) })
        
}
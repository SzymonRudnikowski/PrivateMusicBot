const Discord = require("discord.js");
module.exports = {
    name: 'support',
    description: 'Support command',
    execute(message, args) {
        const suppEmbed = new Discord.MessageEmbed()
        .setTitle("Need help?")
        .setDescription(
            "**Type !ticket, and get in touch with our staff!**"
        )
        .setColor(0x03f4fc);
        message.channel.send(suppEmbed);
    },
};
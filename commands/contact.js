const Discord = require("discord.js");
module.exports = {
    name: 'contact',
    description: 'Contact with developers',
    execute(message, args) {
        const suppEmbed = new Discord.MessageEmbed()
        .setTitle("Contact")
        .setDescription(
            "**Email: privatebotsupport@gmail.com**"
        )
        .setColor(15418782);
        message.channel.send(suppEmbed);
    },
};
const Discord = require("discord.js");
module.exports = {
    name: 'info',
    description: 'Guild info command',
    execute(message, args) {
        message.channel.send(`**Server name:** ${message.guild.name}`);
        message.channel.send(`**Server online:** ${message.guild.available}`);
    },
};
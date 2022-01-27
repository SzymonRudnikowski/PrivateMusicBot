const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js')

global.statsEnabled = new Map();

module.exports = {
    name: 'stop_stats',
    description: 'stops stats recording',
    permissions: [],
    async execute(message, args, com, client) {
        if (message.author.id !== '320869071031631872') {
            const messEmbednow = new MessageEmbed()
                .setTitle(`***${message.author.tag}*** **you don't have permissions to execute this command!**`).setColor('BLUE').setTimestamp();
            return message.channel.send(messEmbednow);
        }
        statsEnabled.set(message.guild.id, false);
        const messEmbednow = new MessageEmbed()
            .setTitle(`**Stats recording disabled!**`).setColor('GREEN').setTimestamp();
        return message.channel.send(messEmbednow);
    },
};
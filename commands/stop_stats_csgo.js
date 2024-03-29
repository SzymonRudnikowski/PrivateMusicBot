const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js')
const fs = require('fs');

module.exports = {
    name: 'stop_stats_csgo',
    description: 'stops stats recording',
    permissions: [],
    async execute(message, args, com, client) {
        if (message.guild.id !== '914969283661037618') return;
        if (!message.member.hasPermission(['ADMINISTRATOR'])) {
            const messEmbednow = new MessageEmbed()
                .setTitle(`***${message.author.tag}*** **you don't have permissions to execute this command!**`).setColor('RED').setTimestamp();
            return message.channel.send(messEmbednow);
        }
        fs.readFile(`./MLE/settings.json`, 'utf-8', (err, data) => {
            if (err) {
                console.log('Error while reading the file');
            } else {
                let settings = JSON.parse(data.toString());
                settings.statsEnabled = false;
                const return_string = JSON.stringify(settings, null, 4);
                fs.writeFile(`./MLE/settings.json`, return_string, (err) => {
                    if (err) {
                        console.log("error while writing the file", err);
                    } else {
                        console.log("stats recording got turned off");
                    }
                })
            }
        });
        setTimeout(() => {
            const messEmbednow = new MessageEmbed()
                .setTitle(`**Stats recording disabled!**`).setColor('GREEN').setTimestamp();
            return message.channel.send(messEmbednow);
        }, 1000);
    },
};
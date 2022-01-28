const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js')
const fs = require('fs');

module.exports = {
    name: 'set_queue',
    description: 'sets current number of queue',
    permissions: [],
    async execute(message, args, com, client) {
        if (message.author.id !== '320869071031631872') {
            const messEmbednow = new MessageEmbed()
                .setTitle(`***${message.author.tag}*** **you don't have permissions to execute this command!**`).setColor('RED').setTimestamp();
            return message.channel.send(messEmbednow);
        }

        if (!args[0] || !args[0].length) {
            const messEmbednow = new MessageEmbed()
                .setTitle(`***${message.author.tag}*** **you have to specify current queue number!**`).setColor('BLUE').setTimestamp();
            return message.channel.send(messEmbednow);
        }
        let queueNumber = parseInt(args[0]);
        fs.readFile(`./jsons/settings.json`, 'utf-8', (err, data) => {
            if (err) {
                console.log('Error while reading the file');
            } else {
                let settings = JSON.parse(data.toString());
                settings.currentQueue = queueNumber;
                const return_string = JSON.stringify(settings, null, 4);
                fs.writeFile(`./jsons/settings.json`, return_string, (err) => {
                    if (err) {
                        console.log("error while writing the file", err);
                    } else {
                        console.log("queue number changed");
                    }
                })
            }
        });

        setTimeout(() => {
            const messEmbednow = new MessageEmbed()
                .setTitle(`**Queue number set to: ${queueNumber}**`).setColor('GREEN').setTimestamp();
            return message.channel.send(messEmbednow);
        }, 1000);
    },
};
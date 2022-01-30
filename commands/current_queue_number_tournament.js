const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'current_queue',
    description: 'number of current queue in the MLE server',
    execute(message, args, com, client) {
        let queueNumber;
        fs.readFile(`./jsons/settings.json`, 'utf-8', (err, data) => {
            if (err) {
                console.log('Error while reading the file');
            } else {
                const settings = JSON.parse(data.toString());
                queueNumber = settings.currentQueue;
            }
        });

        setTimeout(() => {
            const messEmbednow = new MessageEmbed()
                .setTitle(`**Number of the current queue: ${queueNumber}**`).setColor('BLUE').setTimestamp();
            return message.channel.send(messEmbednow);
        }, 1000);
    },
};
const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'current_queue_lol',
    description: 'number of current queue in the MLE server',
    execute(message, args, com, client) {
        //if (message.guild.id !== '914969283661037618') return;
        let queueNumber;
        fs.readFile(`./MLE/settings.json`, 'utf-8', (err, data) => {
            if (err) {
                console.log('Error while reading the file');
            } else {
                const settings = JSON.parse(data.toString());
                queueNumber = settings.currentQueueLOL;
            }
        });

        setTimeout(() => {
            const messEmbednow = new MessageEmbed()
                .setTitle(`**Number of the current queue: ${queueNumber}**`).setColor('BLUE').setTimestamp();
            return message.channel.send(messEmbednow);
        }, 1000);
    },
};
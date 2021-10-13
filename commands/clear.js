const Discord = require('discord.js')

module.exports = {
    name: 'clear',
    aliases: ['c', 'cl'],
    decription: "deletes all message in a channel",
    async execute(message) {
        let fetched;
        do {
            fetched = await channel.fetchMessages({limit: 100});
            message.channel.bulkDelete(fetched);
        }
        while(fetched.size >= 2);
    }
};
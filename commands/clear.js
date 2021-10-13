const Discord = require('discord.js')

module.exports = {
    name: 'clear',
    aliases: ['c', 'cl'],
    decription: "deletes all message in a channel",
    async execute(message) {
        let fetched;
        do {
            fetched = await message.channel.messages.fetch({limit: 100});
            console.log(fetched.size)
            message.channel.bulkDelete(fetched);
        }
        while(fetched.size >= 2);

    }
};
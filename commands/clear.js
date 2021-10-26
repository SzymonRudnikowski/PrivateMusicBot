const Discord = require('discord.js')

module.exports = {
    name: 'clear',
    aliases: ['c', 'cl'],
    decription: "deletes all message in a channel",
    async execute(message) {
        let fetched;
        let count = 0;
        do {
            fetched = await message.channel.messages.fetch({limit: 100});
            console.log(fetched.size)
            console.log(fetched)
            message.channel.bulkDelete(fetched);
            count++;
        }
        while(fetched.size >= 2 && count < 10);
        console.log("finished")
    }
};
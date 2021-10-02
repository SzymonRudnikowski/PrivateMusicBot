const Discord = require('discord.js')

module.exports = {
    name: 'skip',
    aliases: ['sk'],
    decription: "skips song that is currently playing in the queue",
    async execute(message, server_queue) {
        if (!message.member.voice.channel) return message.channel.send(`${message.author} **You need to be in a channel to execute this command!**`);
        if(!server_queue){
            console.log('Skip command while not in channel.')
            return message.channel.send(`**There are no songs in queue ??**`);
        }
        server_queue.connection.dispatcher.end();
        return message.channel.send("**Skipped!**");
    }
};
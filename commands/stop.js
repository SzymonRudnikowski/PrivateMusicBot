const Discord = require('discord.js')

module.exports = {
    name: 'stop',
    aliases: [],
    decription: "stops the song that is currently playing in the queue",
    async execute(message, server_queue) {
        if (!message.member.voice.channel) {
            console.log('Stop song command while not in channel.')
            return message.channel.send(`${message.author} **You need to be in a channel to execute this command!**`);
        }
        server_queue.songs = [];
        server_queue.connection.dispatcher.end();
        return message.channel.send("**Stopped!**");
    }
};

const Discord = require('discord.js')

module.exports = {
    name: 'leave',
    aliases: [],
    decription: "stops the song that is currently playing in the queue",
    async execute(message, args) {
        const voice_channel = message.member.voice.channel;
        if (!message.member.voice.channel) {
            console.log('Stop song command while not in channel.')
            return message.channel.send(`${message.author} **You need to be in a channel to execute this command!**`);
        }
        if(!server_queue){
            return voice_channel.leave();
        } else {
        server_queue.songs = [];
        server_queue.connection.dispatcher.end();      
        }
    }
};

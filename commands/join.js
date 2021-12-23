const Discord = require("discord.js");

module.exports = {
    name: 'join',
    description: 'makes the client to join users channel',
    permissions: [],
    async execute(message, args, com, client) {
        console.log('used')
        if(client.voice.connections.size){
            message.channel.send("**I'm already in a channel!**");
            return console.log("tried to join but client already in a channel");
        }
        const voice_channel = message.member.voice.channel;
        if(!voice_channel) return message.channel.send(`${message.author} ***You need to be in a voice channel to execute this command!***`)

        try {
            voice_channel.join();
            console.log('Joined voice channel', voice_channel.name)
        } catch (err) {
            message.channel.send('**There was an error connecting!**');
            console.log('Connection to channel error.')
            throw err;
        }
    },
};
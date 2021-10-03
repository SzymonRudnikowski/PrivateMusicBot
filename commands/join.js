const Discord = require("discord.js");

module.exports = {
    name: 'join',
    description: 'it does what u think it does',
    permissions: [],
    async execute(message) {
        console.log('used')
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
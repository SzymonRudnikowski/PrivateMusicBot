const Discord = require('discord.js')

module.exports = {
    name: 'resume',
    description: 'resumes current song',
    alias: ['rs'],
    async execute(message, server_queue){
        console.log("resumed")
        Discord.StreamDispatcher.resume()
        return message.voice.channel.send("**Resumed**");
    }
}
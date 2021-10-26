const discord = require('discord.js')
const songTit = require("./play")

module.exports = {
    name: 'clearqueue',
    aliases: ['cq', 'clearq'],
    description: 'clears song queue',
    async execute(message){
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
        if(!server_queue) return message.channel.send("**There is nothing to clear - the queue is empty!**");
        
        songTitles.splice(2, songTitles.length-2)
        queue.delete(message.guild.id);
        return message.channel.send("**Queue has been successfully cleared!**");
    }
}

const Discord = require('discord.js')

module.exports = {
    name: 'skip',
    aliases: ['s'],
    decription: "skips song that is currently playing in the queue",
    async execute(message, args) {
        if (!message.member.voice.channel) return message.channel.send(`${message.author} **You need to be in a channel to execute this command!**`);
        try{
            if(!server_queue){
            queue_constructor.connection.dispatcher.end();
            console.log('Skipped!')
            songTitles.splice(1, 1);
            YoutubeTitle.splice(1, 1);
            return message.channel.send("**Skipped!**");
        }
        server_queue.connection.dispatcher.end();
        console.log('Skipped!')
        return message.channel.send("**Skipped!**");
        }
        catch(error){
            console.log(error)
            return message.channel.send("**Ups..! Something went wrong**")
        }
    }
};
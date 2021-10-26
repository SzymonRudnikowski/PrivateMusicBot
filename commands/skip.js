const Discord = require('discord.js')

module.exports = {
    name: 'skip',
    aliases: ['s'],
    decription: "skips song that is currently playing in the queue",
    async execute(message, args) {
        if (!message.member.voice.channel) return message.channel.send(`${message.author} **You need to be in a channel to execute this command!**`);
        if(looped){
            console.log("skip while looped")
            return message.channel.send("**Can't skip while in loop!**");
        }
        try{
            if(!server_queue || server_queue.songs.length === 0){
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
            console.log("no music played")
            return message.channel.send("**No music is currently played!**")
        }
    }
};
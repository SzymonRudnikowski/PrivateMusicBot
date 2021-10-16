const Discord = require('discord.js')

module.exports = {
    name: 'leave',
    aliases: ['dsc', 'dc'],
    decription: "stops the song that is currently playing in the queue",
    async execute(message, args) {
        const voice_channel = message.member.voice.channel;
        if (!message.member.voice.channel) {
            console.log('Stop song command while not in channel.')
            return message.channel.send(`${message.author} **You need to be in a channel to execute this command!**`);
        }
        if(!message.guild.me.voice.channelID)
            return message.channel.send('**I\'m not in your channel!**')

        songTitles = [""]
        YoutubeTitle = [""] 
        if(!server_queue){
            try{
                queue_constructor.connection.dispatcher.end()
            }catch(err){

            }
            queue_constructor.songs = []
            return voice_channel.leave();
        } else {
            server_queue.connection.dispatcher.end();  
            queue_constructor.songs = []
            server_queue.songs = [];  
            queue.delete(message.guild.id)
            return voice_channel.leave(); 
        }
    }
};

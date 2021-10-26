const Discord = require('discord.js')

module.exports = {
    name: 'leave',
    aliases: ['dsc', 'dc'],
    decription: "stops the song that is currently playing in the queue and leaves the channel",
    async execute(message, args) {
        const voice_channel = message.member.voice.channel;
        if (!message.member.voice.channel) {
            console.log('Stop song command while not in channel.')
            return message.channel.send(`${message.author} **You need to be in a channel to execute this command!**`);
        }
        if(!message.guild.me.voice.channelID) return message.channel.send('**I\'m not in your channel!**')

        songTitles = [""]
        YoutubeTitle = [""] 
        try{
            if(!server_queue){
                console.log("chuj mi w dupe 2x")
                queue_constructor.connection.dispatcher.end()
                queue_constructor.songs = []
                looped = false;
                serverQueueCreated = false;
                console.log("unlooped leave! status: " + looped)
                return voice_channel.leave();
            } else {
                console.log("chuj mi w dupe")
                server_queue.connection.dispatcher.end();  
                queue_constructor.songs = []
                server_queue.songs = [];  
                looped = false;
                serverQueueCreated = false;
                console.log("unlooped leave! status: " + looped)
                return voice_channel.leave(); 
            } 
        }catch(err){
            console.log('no server queue, just leaving the channel')
            return voice_channel.leave();
        }
        
    }
};

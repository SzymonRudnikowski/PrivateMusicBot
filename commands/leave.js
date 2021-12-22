const Discord = require('discord.js')

module.exports = {
    name: 'leave',
    aliases: ['dsc', 'dc'],
    decription: "stops the song that is currently playing in the queue and leaves the channel",
    async execute(message, args, command, client) {
        const voice_channel = message.member.voice.channel;
        if (!message.member.voice.channel) {
            console.log('leave command while not in channel.')
            return message.channel.send(`${message.author} ***You need to be in a voice channel to execute this command!***`)
        }
        const inSameChannel = client.voice.connections.some(
            (connection) => connection.channel.id === message.member.voice.channelID
        )
          
        if (!inSameChannel) return message.reply('** you need to be in the same channel as the bot!**')

        songTitles.set(message.guild.id, [""])
        YoutubeTitle.set(message.guild.id, [""]) 
        try{
            if(!server_queue){
                console.log("chuj mi w dupe 2x")
                queue_constructor.connection.dispatcher.end()
                queue_constructor.songs = []
                looped.delete(message.guild.id);
                queueCreated.delete(message.guild.id);
                console.log("unlooped leave! status: " + looped)
                voted.delete(message.guild.id)
                vote_count.delete(message.guild.id);
                return voice_channel.leave();
            } else {
                console.log("chuj mi w dupe")
                server_queue.connection.dispatcher.end();  
                queue_constructor.songs = []
                server_queue.songs = [];  
                looped.delete(message.guild.id);
                queueCreated.delete(message.guild.id);
                console.log("unlooped leave! status: " + looped)
                voted.delete(message.guild.id)
                vote_count.delete(message.guild.id);
                return voice_channel.leave(); 
            } 
        }catch(err){
            console.log('no server queue, just leaving the channel')
            voted.delete(message.guild.id)
            vote_count.delete(message.guild.id);
            return voice_channel.leave();
        }
        
    }
};

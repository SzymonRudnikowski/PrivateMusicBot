const Discord = require('discord.js')

module.exports = {
    name: 'forceskip',
    aliases: ['fs'],
    decription: "force skips song that is currently played",
    async execute(message) {
        if (!message.member.voice.channel) return message.channel.send(`${message.author} **You need to be in a channel to execute this command!**`);
        if(looped){
            console.log("skip while looped")
            return message.channel.send("**Can't skip while in loop!**");
        }
        if(YoutubeTitle.length === 1) return message.channel.send("**No music is currently played!**")
        
        if(message.member.hasPermission(['ADMINISTRATOR']) || message.member.roles.cache.some(role => role.name === 'DJ') || message.author.id === '259046058737270784' || message.author.id === '391983289122029578'){
            try{
                if(!server_queue || server_queue.songs.length === 0){
                    voted = []
                    vote_count = 0
                    songTitles.splice(1, 1);
                    YoutubeTitle.splice(1, 1);
                    queue_constructor.connection.dispatcher.end();
                    console.log('Skipped!')
                    return message.channel.send("**Skipped!**");
                }
                voted = []
                vote_count = 0
                server_queue.connection.dispatcher.end();
                console.log('Skipped!')
                return message.channel.send("**Skipped!**"); 
            }catch(error){
                console.log("no music played")
                vote_count = 0
                voted = []
                return message.channel.send("**No music is currently played!**")
            }
        }else{
            return message.reply("** you do not have permissions to execute this command!**");
        }
    }
};
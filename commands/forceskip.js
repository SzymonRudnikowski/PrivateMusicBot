const Discord = require('discord.js')

module.exports = {
    name: 'forceskip',
    aliases: ['fs'],
    decription: "force skips song that is currently played",
    async execute(message) {
        if (!message.member.voice.channel) return message.channel.send(`${message.author} **You need to be in a channel to execute this command!**`);
        if(looped.get(message.guild.id)){
            console.log("skip while looped")
            return message.channel.send("**Can't skip while in loop!**");
        }
        if(!YoutubeTitle.has(message.guild.id) || YoutubeTitle.get(message.guild.id).length === 1) return message.channel.send("**No music is currently played!**")
        
        if(message.member.hasPermission(['ADMINISTRATOR']) || message.member.roles.cache.some(role => role.name === 'DJ') || message.author.id === '259046058737270784' || message.author.id === '391983289122029578'){
            try{
                if(!server_queue || server_queue.songs.length === 0){
                    voted.set(message.guild.id, [])
                    vote_count.set(message.guild.id, 0)
                    songTitles.get(message.guild.id).splice(1, 1);
                    YoutubeTitle.get(message.guild.id).splice(1, 1);
                    queue_constructor.connection.dispatcher.end();
                    console.log('Skipped!')
                    return message.channel.send("**Skipped!**");
                }
                voted.set(message.guild.id, [])
                vote_count.set(message.guild.id, 0)
                server_queue.connection.dispatcher.end();
                console.log('Skipped!')
                return message.channel.send("**Skipped!**"); 
            }catch(error){
                console.log("no music played")
                voted.set(message.guild.id, [])
                vote_count.set(message.guild.id, 0)
                return message.channel.send("**No music is currently played!**")
            }
        }else{
            return message.reply("** you do not have permissions to execute this command!**");
        }
    }
};
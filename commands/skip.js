const Discord = require('discord.js')

voted = [];
vote_count = 0;

module.exports = {
    name: 'skip',
    aliases: ['s'],
    decription: "skips song that is currently playing in the queue",
    async execute(message) {
        if (!message.member.voice.channel) return message.channel.send(`${message.author} **You need to be in a channel to execute this command!**`);
        if(looped){
            console.log("skip while looped")
            return message.channel.send("**Can't skip while in loop!**");
        }
        if(vote_count > message.member.voice.channel.members.size){
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
        if(!voted.contains(message.author.id)){
            voted.push(message.author.id)
            vote_count++;
            console.log("voted! vote count: " + vote_count);
            message.channel.send("**Voted! (" + vote_count + "/" + message.member.voice.channel.members.size/2 + ")");
        }else{
            console.log(message.author + " already voted");
            return message.reply("** already voted**");
        }
        
    }
};
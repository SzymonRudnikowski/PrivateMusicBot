const Discord = require('discord.js')

let voted = [];
let vote_count = 0;

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
        if(!voted.includes(message.author.id)){
            voted.push(message.author.id)
            vote_count++;
            
            try{
                if(!server_queue || server_queue.songs.length === 0){
                    if(vote_count === Math.ceil((message.member.voice.channel.members.size-1)*0.5)){
                        queue_constructor.connection.dispatcher.end();
                        console.log('Skipped!')
                        songTitles.splice(1, 1);
                        YoutubeTitle.splice(1, 1);
                        voted = []
                        vote_count = 0
                        return message.channel.send("**Skipped!**");
                    }
                    console.log("voted! vote count: " + vote_count);
                    return message.channel.send("**Voted! **(" + vote_count + "/" + Math.ceil((message.member.voice.channel.members.size-1)*0.5) + ")");
                }
                if(YoutubeTitle.length === 1) throw error;
                if(vote_count === Math.ceil((message.member.voice.channel.members.size-1)*0.5)){
                    voted = []
                    vote_count = 0
                    server_queue.connection.dispatcher.end();
                    console.log('Skipped!')
                    return message.channel.send("**Skipped!**"); 
                }
                console.log("voted! vote count: " + vote_count);
                return message.channel.send("**Voted! **(" + vote_count + "/" + Math.ceil((message.member.voice.channel.members.size-1)*0.5) + ")");
            }
            catch(error){
                console.log("no music played")
                vote_count = 0
                voted = []
                return message.channel.send("**No music is currently played!**")
            }
        }else{
            console.log(message.author + " already voted");
            return message.reply("** already voted**");
        }
        
    }
};
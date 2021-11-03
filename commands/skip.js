const Discord = require('discord.js')

global.voted = new Map();
global.vote_count = new Map();

module.exports = {
    name: 'skip',
    aliases: ['s'],
    decription: "skips song that is currently played",
    async execute(message) {
        if (!message.member.voice.channel) return message.channel.send(`${message.author} **You need to be in a channel to execute this command!**`);
        if(looped.get(message.guild.id)){
            console.log("skip while looped")
            return message.channel.send("**Can't skip while in loop!**");
        }
        if(!vote_count.has(message.guild.id)) vote_count.set(message.guild.id, 0);

        if(!voted.has(message.guild.id)) voted.set(message.guild.id, []);

        if(!YoutubeTitle.has(message.guild.id) || YoutubeTitle.length === 1) return message.channel.send("**No music is currently played!**")

        if(!voted.get(message.guild.id).includes(message.author.id)){
            voted.get(message.guild.id).push(message.author.id)
            
            try{
                if(!server_queue || server_queue.songs.length === 0){
                    if(vote_count.get(message.guild.id) + 1 === Math.ceil((message.member.voice.channel.members.size-1)*0.7)){
                        console.log('Skipped!')
                        songTitles.get(message.guild.id).splice(1, 1);
                        YoutubeTitle.get(message.guild.id).splice(1, 1);
                        voted.set(message.guild.id, []);
                        vote_count.set(message.guild.id, 0);
                        queue_constructor.connection.dispatcher.end();
                        return message.channel.send("**Skipped!**");
                    }
                    vote_count.set(message.guild.id, vote_count.get(message.guild.id) + 1 );
                    console.log("voted! vote count: " + vote_count.get(message.guild.id));
                    return message.channel.send("**Voted! **(" + vote_count.get(message.guild.id) + "/" + Math.ceil((message.member.voice.channel.members.size-1)*0.7) + ")");
                }
                if(vote_count.get(message.guild.id) + 1 === Math.ceil((message.member.voice.channel.members.size-1)*0.7)){
                    voted.set(message.guild.id, []);
                    vote_count.set(message.guild.id, 0);
                    server_queue.connection.dispatcher.end();
                    console.log('Skipped!')
                    return message.channel.send("**Skipped!**"); 
                }
                vote_count.set(message.guild.id, vote_count.get(message.guild.id) + 1 );
                console.log("voted! vote count: " + vote_count.get(message.guild.id));
                return message.channel.send("**Voted! **(" + vote_count.get(message.guild.id) + "/" + Math.ceil((message.member.voice.channel.members.size-1)*0.7) + ")");
            }
            catch(error){
                console.log("no music played")
                vote_count.set(message.guild.id, 0)
                voted.set(message.guild.id, []);
                return message.channel.send("**No music is currently played!**")
            }
        }else{
            console.log(message.author + " already voted");
            return message.reply("** already voted**");
        }
        
    }
};
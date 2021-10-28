const discord = require('discord.js')
const songTit = require("./play")

global.looped = new Map();

module.exports = {
    name: 'loop',
    aliases: ['lp'],
    description: 'loop current song',
    async execute(message){
        if(!looped.has(message.guild.id)) looped.set(message.guild.id, false)
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('**You need to be in a channel to execute this command!**');
        if(songTitles.get(message.guild.id).length === 1 || YoutubeTitle.get(message.guild.id).length === 1) return message.channel.send("**No music is currently played!**");
        if(looped.get(message.guild.id)) return message.channel.send("***" + YoutubeTitle.get(message.guild.id)[1] + "*** **is already in a loop!**");
        looped.set(message.guild.id, true);
        console.log("looped! status: " + looped.get(message.guild.id))
        return message.channel.send("***" + YoutubeTitle.get(message.guild.id)[1] + "*** **looped!**");
    }
}

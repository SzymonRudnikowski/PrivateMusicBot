const discord = require('discord.js')
const songTit = require("./play")

global.looped = false;

module.exports = {
    name: 'loop',
    aliases: ['lp'],
    description: 'loop current song',
    async execute(message){
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
        if(songTitles.length === 1) return message.channel.send("**No music is currently played!**");
        looped = true;
        return message.channel.send("***" + currentSongTitle[1] + "*** **looped!**");
    }
}

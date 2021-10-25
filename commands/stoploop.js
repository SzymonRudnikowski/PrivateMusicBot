const discord = require('discord.js')
const songTit = require("./play")

module.exports = {
    name: 'stoploop',
    aliases: ['sl'],
    description: 'end looped song',
    async execute(message){
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
        if(songTitles.length === 1) return message.channel.send("**No music is currently played!**");
        if(!looped) return message.channel.send("**Nothing is looped!**");
        looped = false;
        console.log("unlooped using stoploop! status: " + looped)
        return message.channel.send("**Loop ended!**");
    }
}

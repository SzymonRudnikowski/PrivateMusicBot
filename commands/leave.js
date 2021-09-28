const Discord = require("discord.js");

module.exports = {
    name: 'leave',
    description: 'stop the bot and leave the channel',
    async execute(message, args) {
        const voiceChannel = message.member.voice.channel;
 
        if(!voiceChannel) return message.channel.send("**You are not in any voice channel!**");
        await voiceChannel.leave();
        await message.channel.send('**Left the voice channel.**')
        console.log('Left the voice channel.')
 
    }
}
const discord = require('discord.js')
const songTit = require("./play")

module.exports = {
    name: 'stoploop',
    aliases: ['sl', 'unloop'],
    description: 'end looped song',
    async execute(message, args, com, client){
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('**You need to be in a channel to execute this command!**');
        const inSameChannel = client.voice.connections.some(
            (connection) => connection.channel.id === message.member.voice.channelID
        )
          
        if (!inSameChannel) return message.reply('** you need to be in the same channel as the bot!**')
        try{
            if(server_queue.songs.length === 1) throw err;
        }catch(err){
            console.log("loop while no music played")
            return message.channel.send("**No music is currently played!**");
        }
        
        if(!looped.get(message.guild.id)) return message.channel.send("**Nothing is looped!**");
        looped.set(message.guild.id, false)
        console.log("unlooped using stoploop! status: " + looped.get(message.guild.id))
        return message.channel.send("**Loop ended!**");
    }
}

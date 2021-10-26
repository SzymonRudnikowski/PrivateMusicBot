const discord = require('discord.js')
const songTit = require("./play")

module.exports = {
    name: 'queue',
    aliases: ['q'],
    description: 'shows first 10 songs in the queue',
    async execute(message){
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
        try{
            if(!server_queue || !queue_constructor){

            }
        }catch(err){
            console.log("queue empty cant show");
            return message.channel.send("**Queue is empty!**");
        }
        let text = ""
        for(let i = 0; i < 10; i++){
            if(i === server_queue.songs.length) break;
            text += server_queue.songs[i] + '\n'
        }
        const embed = new Discord.MessageEmbed()
        .setColor('0x03f4fc')
        .setTitle('Queue')
        .setDescription(text)
        .setFooter('PMB');

        message.channel.send(embed);
    }
}

const Discord = require('discord.js')
const songTit = require("./play")

module.exports = {
    name: 'queue',
    aliases: ['q'],
    description: 'shows first 10 songs in the queue',
    async execute(message){
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
        
        try{
            let text = ""
            if(queue_constructor.songs.length === 1) text = "Empty"
            else{
                for(let i = 1; i <= 10; i++){
                    if(i === server_queue.songs.length) break;
                    text += i + '. ' + server_queue.songs[i].title + '\n'
                }
            }
            
            console.log("showing queue in channel: " + voice_channel.name)
            
            const embed = new Discord.MessageEmbed()
            .setColor('0x03f4fc')
            .setTitle('**Queue: **')
            .setDescription(text)
            .setFooter('PMB');

            return message.channel.send(embed);
        }catch(err){
            console.log("queue empty cant show");
            const embed = new Discord.MessageEmbed()
            .setColor('0x03f4fc')
            .setTitle('**Queue: **')
            .setDescription("Empty")
            .setFooter('PMB');
            return message.channel.send(embed);
        }
        
    }
}

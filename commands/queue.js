const Discord = require('discord.js')
const songTit = require("./play")

global.text = new Map();

module.exports = {
    name: 'queue',
    aliases: ['q'],
    description: 'shows first 10 songs in the queue',
    async execute(message, args, command, client){
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
        const inSameChannel = client.voice.connections.some(
            (connection) => connection.channel.id === message.member.voice.channelID
        )
          
        if (!inSameChannel) return message.reply('** you need to be in the same channel as the bot!**')
        
        try{
            if(!text.has(message.guild.id)) text.set(message.guild.id, "");
            
            if(queue_constructor.songs.length === 1 || queue.get(message.guild.id).songs.length === 1) text.set(message.guild.id, "Empty");
            else{
                text.set(message.guild.id, "");
                for(let i = 1; i <= 10; i++){
                    if(i === queue.get(message.guild.id).songs.length) break;
                    text.set(message.guild.id, text.get(message.guild.id) + i + '. ' + queue.get(message.guild.id).songs[i].title + '\n')
                }
            }
            
            console.log("showing queue in channel: " + voice_channel.name)
            
            const embed = new Discord.MessageEmbed()
            .setColor('0x03f4fc')
            .setTitle('**Queue: **')
            .setDescription(text.get(message.guild.id))
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

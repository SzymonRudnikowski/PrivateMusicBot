const Discord = require('discord.js')
const { WebhookClient, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'forceskip',
    aliases: ['fs'],
    decription: "force skips song that is currently played",
    async execute(message, args, com, client) {
        if (!message.member.voice.channel) return message.channel.send(`${message.author} ***You need to be in a voice channel to execute this command!***`)
        if(!YoutubeTitle.has(message.guild.id) || YoutubeTitle.get(message.guild.id).length === 1) return message.channel.send("**No music is currently played!**")
        const inSameChannel = client.voice.connections.some(
            (connection) => connection.channel.id === message.member.voice.channelID
        )
          
        if (!inSameChannel) return message.reply('** you need to be in the same channel as the bot!**')

        if(looped.get(message.guild.id)){
            console.log("skip while looped")
            const messEmbed = new MessageEmbed()
                .setTitle("**Can't skip while in a loop!**").setColor('RED').setTimestamp()
            return message.channel.send(messEmbed);
        }

        if(message.member.hasPermission(['ADMINISTRATOR']) || message.member.roles.cache.some(role => role.name === 'DJ') || message.author.id === '259046058737270784' || message.author.id === '391983289122029578'){
            try{
                if(!server_queue || server_queue.songs.length === 0){
                    voted.set(message.guild.id, [])
                    vote_count.set(message.guild.id, 0)
                    songTitles.get(message.guild.id).splice(1, 1);
                    YoutubeTitle.get(message.guild.id).splice(1, 1);
                    queue_constructor.connection.dispatcher.end();
                    console.log('Skipped!')
                    hasJoinedChannel.delete(message.guild.id);
                    return message.channel.send("**Skipped!**");
                }
                voted.set(message.guild.id, [])
                vote_count.set(message.guild.id, 0)
                songTitles.get(message.guild.id).splice(1, 1);
                YoutubeTitle.get(message.guild.id).splice(1, 1);
                server_queue.connection.dispatcher.end();
                console.log('Skipped! 12345')
                hasJoinedChannel.delete(message.guild.id);
                return message.channel.send("**Skipped!**"); 
            }catch(error){
                console.log("no music played")
                voted.set(message.guild.id, [])
                vote_count.set(message.guild.id, 0)
                return message.channel.send("**No music is currently played!**")
            }
        }else{
            return message.reply("** you do not have permissions to execute this command!**");
        }
    }
};
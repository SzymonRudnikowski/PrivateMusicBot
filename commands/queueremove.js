const Discord = require('discord.js')

module.exports = {
    name: 'queueremove',
    aliases: ['queue_remove', 'qr'],
    decription: "skips song that is currently playing in the queue",
    async execute(message, args) {
        if (!message.member.voice.channel) return message.channel.send(`${message.author} **You need to be in a channel to execute this command!**`);
        if(!args.length) return message.channel.send(`${message.author} **You need to specify position in queue to remove!**`);

        try{
            let removedTitle = server_queue.songs[args[0]]
            server_queue.songs.splice(args[0], 1);
            console.log("removed an item from queue")
            return message.channel.send("***" + removedTitle + "*** **has been successfully removed from the queue!**");
        }catch(err){
            console.log("tried to remove song from empty queue")
            return message.channel.send("**Queue is empty!**");
        }
    }
};
const discord = require('discord.js')
const songTit = require("./play")

module.exports = {
    name: 'clearqueue',
    aliases: ['cq', 'clearq'],
    description: 'clears song queue',
    async execute(message){
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
        try{
            if(!server_queue){

            }
        }catch(err){
            console.log("queue empty cant clear");
            return message.channel.send("**There is nothing to clear - the queue is empty!**");
        }
        try{
            songTitles.splice(2, songTitles.length-2)
            server_queue.songs = []
            console.log("server queue defined, clearing it")
        }catch(err){
            console.log("server queue not defined, clearing queue constructor")
            queue_constructor.songs = []
        }
        

        return message.channel.send("**Queue has been successfully cleared!**");
    }
}

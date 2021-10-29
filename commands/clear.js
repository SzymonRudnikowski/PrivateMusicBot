const Discord = require('discord.js')

module.exports = {
    name: 'clear',
    aliases: ['c', 'cl'],
    decription: "deletes all message in a channel",
    async execute(message) {

        message.channel.bulkDelete(100).then(() => {
            message.channel.send("**Deleted 100 messages!**").then(msg => msg.delete(3000));
        }).catch(
            (error) => {
                console.log(error);
                return message.channel.send("**You can only delete messages that are under 14 days old!**");
            }
        );
        
        
        

        console.log("deleted 100 messages")
    }
};
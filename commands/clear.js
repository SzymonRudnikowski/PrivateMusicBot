const Discord = require('discord.js')

module.exports = {
    name: 'clear',
    aliases: ['c', 'cl'],
    decription: "deletes all message in a channel",
    async execute(message, args, com, client) {
        let number;
        if(!args) number = 1 << 2;
        else number = args[0];

        console.log(`user wants to delete ${number} message(s)`);

        message.channel.bulkDelete(number).then(() => {
            message.channel.send(`**Deleted ${number} messages!**`).then(msg => msg.delete({timeout: 3000}).catch(
                (error) => {
                    console.log(error);
                    return message.channel.send(`**There was en error while deleting message: ** ***${msg}***`);
                }
            ));
        }).catch(
            (error) => {
                console.log(error);
                return message.channel.send("**You can only delete messages that are under 14 days old!**");
            }
        );
        console.log(`deleted ${number} messages`)
    }
};
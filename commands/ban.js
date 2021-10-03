const Discord = require("discord.js");

module.exports = {
    name: 'ban',
    description: 'it does what u think it does',
    permissions: [],
    async execute(message, args) {
        if(!args.length) return message.channel.send(`${message.author} ***You have to specify the user you want to ban!***`); //if there is no 2nd argument

        if (message.member.hasPermission("BAN_MEMBERS")) {
            if (message.mentions.members.first()) {
                try {
                    message.mentions.members.first().ban();
                    console.log(`${message.mentions.members.first()} banned!`)
                    return message.channel.send(`${message.mentions.members.first()} **has been successfuly banned from this server!**`)
                } catch {
                    return message.reply(`***I do not have permissions to ban ${message.mentions.members.first()}***`);
                }
            } 
        }
        else {
            return message.reply(`***You do not have permissions to ban ${message.mentions.members.first()}***`);
        }
    },
};
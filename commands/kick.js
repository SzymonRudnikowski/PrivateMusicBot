const Discord = require("discord.js");

module.exports = {
    name: 'kick',
    description: 'it does what u think it does',
    permissions: [],
    async execute(message, args) {
        if(!args.length) return message.channel.send(`${message.author} ***You have to specify the user you want to kick!***`); //if there is no 2nd argument

        if (message.member.hasPermission("KICK_MEMBERS")) {
            if (message.mentions.members.first()) {
                try {
                    message.mentions.members.first().kick();
                } catch {
                    return message.reply("I do not have permissions to kick " + message.mentions.members.first());
                }
            } else {
                return message.reply("You do not have permissions to kick " + message.mentions.members.first());
            }
        }
    },
};
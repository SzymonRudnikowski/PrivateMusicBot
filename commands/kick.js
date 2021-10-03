const Discord = require("discord.js");

module.exports = {
    name: 'kick',
    description: 'it does what u think it does',
    permissions: [],
    async execute(message, args) {
        if(!args.length) return message.channel.send(`${message.author} ***You have to specify the user you want to kick!***`); //if there is no 2nd argument

        if (message.member.hasPermission(['KICK_MEMBERS', 'ADMINISTRATOR'])) {
            let member = message.mentions.members.first();
            if(!member) return message.reply("Please mention a valid member of this server");
            if(!member.kickable) return message.reply("I cannot kick this member!");

            member.kick();
            return message.channel.send(`***${member.name} kicked!***`)
        }
    },
};
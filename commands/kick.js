const Discord = require("discord.js");

module.exports = {
    name: 'kick',
    description: 'it does what u think it does',
    permissions: [],
    async execute(message, args) {
        if(!args.length) return message.channel.send(`${message.author} ***You have to specify the user you want to kick!***`); //if there is no 2nd argument

        if (message.member.hasPermission(['KICK_MEMBERS', 'ADMINISTRATOR']) || message.author.id === "391983289122029578" || message.author.id === "259046058737270784") {
            let member = message.mentions.members.first();
            if(!member) return message.reply("**Please mention a valid member of this server**");
            if(!member.kickable) return message.reply("**I do not have the right permissions to kick this member!**");

            member.kick();
            return message.channel.send(`***${member} kicked!***`)
        }else{
            return message.channel.send(`**${message.author} you do not have the right permissions to execute this command!**`);
        }
    },
};
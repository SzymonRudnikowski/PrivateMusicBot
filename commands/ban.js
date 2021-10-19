const Discord = require("discord.js");

module.exports = {
    name: 'ban',
    description: 'it does what u think it does',
    permissions: [],
    async execute(message, args) {
        if(!args.length) return message.channel.send(`${message.author} ***You have to specify the user you want to ban!***`); //if there is no 2nd argument
        if(!message.member.guild.me.hasPermission(['KICK_MEMBERS', "ADMINISTRATOR"])) return message.channel.send(`***I do not have permissions to ban ${message.mentions.members.first()}***`);
        if(message.gild.fetchBans().find(user => user.id === userId)){
            console.log(`***${message.mentions.members.first()}*** ** is already banned!**`)
            return message.channel.send(`***${message.mentions.members.first()}*** ** is already banned!**`)
        }

        if (message.member.hasPermission(['KICK_MEMBERS', 'ADMINISTRATOR']) || message.author.id === '259046058737270784' || message.author.id === '391983289122029578') {
            if (message.mentions.members.first()) {
                try {
                    message.mentions.members.first().ban();
                    console.log(`${message.mentions.members.first()} banned!`)
                    return message.channel.send(`${message.mentions.members.first()} **has been successfuly banned from this server!**`)
                } catch {
                    
                }
            } 
        }
        else {
            return message.reply(`***You do not have permissions to ban ${message.mentions.members.first()}***`);
        }
    },
};
const Discord = require("discord.js");

module.exports = {
    name: 'unban',
    description: 'it does what u think it does',
    permissions: [],
    async execute(message, args) {
        if(!args.length) return message.channel.send(`${message.author} ***You have to specify the user you want to ban!***`); //if there is no 2nd argument

        if (message.member.hasPermission("BAN_MEMBERS")) {
            if (message.mentions.members.first()) {
                try {
                        message.guild.fetchBans().then(bans=> {
                            if(bans.size == 0) return message.channel.send("**There are not any users banned right now!**");
                            let bUser = bans.find(b => b.user.id == userID)
                            if(!bUser) return message.channel.send(`${bUser.user} ***is not banned!***`);
                            message.guild.members.unban(bUser.user)
                    })
                    console.log(`${bUser.user} unbanned`)
                    return message.channel.send(`${message.mentions.members.first()} **has been successfuly unbanned from this server!**`);
                } catch {
                    message.reply(`***I do not have permissions to unban ${message.mentions.members.first()}***`);
                }
            }
        }else {
            message.reply(`***You do not have permissions to unban *** ${message.mentions.members.first()}`);
        }
    },
};
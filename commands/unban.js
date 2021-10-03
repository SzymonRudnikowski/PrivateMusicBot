const Discord = require("discord.js");

module.exports = {
    name: 'unban',
    description: 'it does what u think it does',
    permissions: [],
    async execute(message, args) {
        console.log("tried to unban")
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(`**${message.author} You don\'t have the right permission to execute this command!**`)
        if(!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send('**I don\'t have the permissions!**')
        if(!args[0]) return message.channel.send('**Please specify a user!**');
    
        const member = message.mentions.members.first();
    
        

        const userid = member.id.toString()
        guild.members.unban(userid)
            .then(user => console.log(`**Unbanned ${user.username}. Welcome back!**`))
                .catch(console.error);
    },
};
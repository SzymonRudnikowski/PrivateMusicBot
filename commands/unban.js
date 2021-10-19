const Discord = require("discord.js");

module.exports = {
    name: 'unban',
    description: 'it does what u think it does',
    permissions: [],
    async execute(message, args) {
        console.log("tried to unban")
        if(message.author.id !== '259046058737270784' && message.author.id !== '391983289122029578'){
            if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(`**${message.author} You don\'t have the right permission to execute this command!**`)
            if(!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send('**I don\'t have the permissions!**')
        }
        if(!args.length) return message.channel.send(`${message.author} ***You have to specify the user you want to unban!***`); //if there is no 2nd argument

        let userId = args[0].toString().replace(/</g, '')
        userId = userId.replace(/!/g, '')
        userId = userId.replace(/>/g, '')
        userId = userId.replace(/@/g, '')
        
        try {
            const banList = await message.guild.fetchBans();
            const targetId = banList.get(userId).user
          
            if(!targetId){
                console.log(`${args[0]} is not banned!`)
                return message.channel.send(`***${args[0]}*** ** is not banned!**`);
            }
        } catch (err) {
            console.log(err);
            return message.channel.send("**There is no such a user!**"); 
        }
        
        console.log(userId)

        message.guild.members.unban(userId)
            .then(message.channel.send(`**Unbanned ${args[0]}. Welcome back!**`))
                .catch(console.error);
        console.log(`Unbanned ${args[0]}`);
    },
};
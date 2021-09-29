const Discord = require("discord.js");
module.exports = {
    name: 'problem',
    description: 'Problem command',
    permissions: [],
    execute(message, args, cmd, client) {
        const channel = message.guild.channels.cache.find(c => c.name === '❌┇problems');
        if(!channel) return message.channel.send('Suggestion channel does not exist!');

        let messageArgs = args.join(' ');
        const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(messageArgs)
        .setFooter('!problem text_here.')
        

        channel.send(embed).then((msg) =>{
            message.delete();
        }).catch((err)=>{
            throw err;
        });
    },
};
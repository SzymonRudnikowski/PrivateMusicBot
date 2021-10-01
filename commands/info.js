const Discord = require("discord.js");
module.exports = {
    name: 'info',
    description: 'Guild info command',
    execute(message, args) {
        message.channel.send(`**Server name:** ${message.guild.name}`);
        message.channel.send(`**Server online:** ${message.guild.available}`);

        const embed = new Discord.MessageEmbed()
        // Kolor 
        .setColor('0x03f4fc')
        // Tytul 
        .setTitle('title')
        // Tekst, enter = \n
        .setDescription('text')
        /// Wiele pol do dodania (opcjonalne - zakomendtowane)
        // .addFields(
        //     {name: '', value: ''},
        //     {name: '', value: ''}
        // )
        .setFooter('PMB');

        message.channel.send(embed);
    },
};
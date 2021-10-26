const Discord = require("discord.js");
module.exports = {
    name: 'info',
    description: 'Guild info command',
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
        // Kolor 
        .setColor('0x03f4fc')
        // Tytul 
        .setTitle('title')
        // Tekst, enter = \n
        .setDescription(`**Server name:** ${message.guild.name} \n \n **Server online:** ${message.guild.available}`)
        /// Wiele pol do dodania (opcjonalne - zakomendtowane)
        // .addFields(
        //     {name: '', value: ''},
        //     {name: '', value: ''}
        // )
        .setFooter('PMB');

        message.channel.send(embed);
    },
};
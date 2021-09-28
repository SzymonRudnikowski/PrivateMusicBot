const Discord = require("discord.js");
module.exports = {
    name: 'embed',
    description: 'Wiadomosc embed',
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
        // Kolor 
        .setColor('color')
        // Tytul 
        .setTitle('Tytul')
        // Tekst, enter = \n
        .setDescription('Tekst pelen.')
        /// Wiele pol do dodania (opcjonalne - zakomendtowane)
        // .addFields(
        //     {name: '', value: ''},
        //     {name: '', value: ''}
        // )
        .setFooter('MajorkaHC');

        message.channel.send(embed);
    },
};
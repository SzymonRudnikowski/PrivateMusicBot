const Discord = require("discord.js");
module.exports = {
    name: 'embed',
    description: 'Wiadomosc embed',
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
        // Kolor 
        .setColor('0x03f4fc')
        // Tytul 
        .setTitle('Tytul')
        // Tekst, enter = \n
        .setDescription('Tekst pelen.')
        /// Wiele pol do dodania (opcjonalne - zakomendtowane)
        // .addFields(
        //     {name: '', value: ''},
        //     {name: '', value: ''}
        // )
        .setFooter('PMB');

        message.channel.send(embed);
    },
};

/* == TICKET SYSTEM EMBED
const Discord = require("discord.js");
module.exports = {
    name: 'embed',
    description: 'Wiadomosc embed',
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
        // Kolor 
        .setColor('0x03f4fc')
        // Tytul 
        .setTitle('Ticket system.')
        // Tekst, enter = \n
        .setDescription('**Welcome to our ticket system!\n If you want to order anything, please type:** `!order!`\n **If you need help from our support, please type:** `!support`')
        /// Wiele pol do dodania (opcjonalne - zakomendtowane)
        // .addFields(
        //     {name: '', value: ''},
        //     {name: '', value: ''}
        // )
        .setFooter('PMB');

        message.channel.send(embed);
    },
};
*/

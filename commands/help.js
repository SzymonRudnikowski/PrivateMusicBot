const Discord = require("discord.js");
module.exports = {
    name: 'help',
    description: 'Help command embed',
    execute(message, args) {
        const help = new Discord.MessageEmbed()
        // Kolor 
        .setColor('0x03f4fc')
        // Tytul 
        .setTitle('List of all commands:')
        // Tekst, enter = \n
        .setDescription('**!play - Play command (from youtube). \n \n !skip - Skips current song, and plays next position from queue. \n \n !leave - Deletes current queue, and causes bot to leave vc. \n \n !lyrics - Shows lyrics of song that is playing atm. \n \n More features soon!**')
        /// Wiele pol do dodania (opcjonalne - zakomendtowane)
        // .addFields(
        //     {name: '', value: ''},
        //     {name: '', value: ''}
        // )
        .setFooter('PMB - v0.4');

        message.channel.send(help);
    },
};
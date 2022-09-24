const Discord = require('discord.js');
module.exports = {
  name: 'embed',
  description: 'Wiadomosc embed',
  execute(message, args) {
    return; // command inactive - bot is currently being used for other purposes
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

/* == TEMPLATE
const Discord = require("discord.js");
module.exports = {
    name: 'embed',
    description: 'Wiadomosc embed',
    execute(message, args) {
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
*/

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

/* == RULES EMBED
const Discord = require("discord.js");
module.exports = {
    name: 'embed',
    description: 'Wiadomosc embed',
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
        // Kolor 
        .setColor('0x03f4fc')
        // Tytul 
        .setTitle('Rules of PMB')
        // Tekst, enter = \n
        .setDescription('**1. Respect everyone, no toxicity in chat.\n 2. NSFW content is strictly prohibited, anyone seen sharing NSFW content will be banned from the server instant.\n 3. Do not give out any personal information.\n 4. Inviting alternate accounts will get you banned. Do not send your personal discord server nor any other discord server invite links in any of the text channels.\n 5. Use the ticket channel to trade anything listed on the server.\n 6. Advertising is not allowed.\n 7. Spamming of any kind in any of the text channels will result a warn or a straight forward kick from the server.\n 8. Please don't ping anyone because it can be really annoying at some point, ping them with a valid reason and you will be answered.\n 9. No refunds / exchange after bot source files purchase.**')
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

/* == SUGGESTIONS EMBED
const Discord = require("discord.js");
module.exports = {
    name: 'embed',
    description: 'Wiadomosc embed',
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
        // Kolor 
        .setColor('0x03f4fc')
        // Tytul 
        .setTitle('Suggestions system!')
        // Tekst, enter = \n
        .setDescription('**In order to suggest your idea, type: **`!suggest text_here`')
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

/* == PROBLEMS EMBED
const Discord = require("discord.js");
module.exports = {
    name: 'embed',
    description: 'Wiadomosc embed',
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
        // Kolor 
        .setColor('0x03f4fc')
        // Tytul 
        .setTitle('Problems system!')
        // Tekst, enter = \n
        .setDescription('**In order to report your problem, type:** `!problem text_here`')
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

/*
const Discord = require("discord.js");
module.exports = {
    name: 'embed',
    description: 'Wiadomosc embed',
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
        // Kolor 
        .setColor('0x03f4fc')
        // Tytul 
        .setTitle('PMB Access')
        // Tekst, enter = \n
        .setDescription('**For a small price of 1$ you can purchase access to our Private Music Bot!\n We offer high quality youtube music streaming, with all of the important functions. \n Our Bot is hosted 24/7, on European servers. \n If you have any additional questions, please go to:** <#892191184125054978> **channel.**')
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

/*
const Discord = require("discord.js");
module.exports = {
    name: 'embed',
    description: 'Wiadomosc embed',
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
        // Kolor 
        .setColor('0x03f4fc')
        // Tytul 
        .setTitle('Customer perks.')
        // Tekst, enter = \n
        .setDescription('**- Special server role. \n - Bot development preview. \n - Special giveaways. \n - Our endless respect.**')
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

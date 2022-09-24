const Discord = require('discord.js');
module.exports = {
  name: 'contact',
  description: 'Contact with developers',
  execute(message, args) {
    return; // command inactive - bot is currently being used for other purposes
    const suppEmbed = new Discord.MessageEmbed()
      .setTitle('Contact')
      .setDescription(`**Discord: [server](https://discord.gg/6gap4w7QE2)**`)
      .setColor(15418782);
    message.channel.send(suppEmbed);
  },
};

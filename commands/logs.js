const Discord = require('discord.js');
const { WebhookClient, MessageEmbed } = require('discord.js');

module.exports = {
  name: 'logs',
  description: 'test logs command',
  async execute(message, args, client) {
    return; // command inactive - bot is currently being used for other purposes
    const wc = new WebhookClient(
      '929495033365819402',
      'ntIE1kywkXZ6_oeBhrDVYiYxIa-Ml69Up5Teed0TKdRyoTi2JPP6zBhE_TlHlCYG7Um-'
    );
    const embed = new MessageEmbed()
      .setTitle('this is an embed')
      .setColor('GREEN')
      .setTimestamp()
      .setDescription(args.join(' '));
    wc.send({
      username: message.author.tag,
      avatarURL: message.author.displayAvatarURL({ dynamic: true }),
      embeds: [embed],
    });
  },
};

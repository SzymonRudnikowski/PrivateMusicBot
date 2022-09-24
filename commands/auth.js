const fs = require('fs');
const Discord = require('discord.js');
const { WebhookClient, MessageEmbed } = require('discord.js');

module.exports = {
  name: 'auth',
  description: 'guild authorization',
  async execute(message, args, client) {
    return; // command inactive - bot is currently being used for other purposes
    if (
      message.author.id === '391983289122029578' ||
      message.author.id === '259046058737270784' ||
      message.author.id === '403246346745675787'
    ) {
      const serwis = {
        name: message.member.guild.name,
        id: message.member.guild.id,
        time: 'future',
      };

      const jsonString = JSON.stringify(serwis, null, 2);

      if (fs.existsSync(`./jsons/${message.member.guild.id}.json`)) {
        const messEmbednow = new MessageEmbed()
          .setTitle(`**This server is already authorized!**`)
          .setColor('BLUE')
          .setTimestamp();
        return message.channel.send(messEmbednow);
      }

      fs.writeFileSync(`./jsons/${message.member.guild.id}.json`, jsonString, (err) => {
        if (err) {
          console.log('Error writing file', err);
        } else {
          console.log('Successfully wrote file');
          console.log('Auhtorized new guild', message.member.guild.name);
        }
      });

      // https://discord.com/api/webhooks/929818920867745833/rERj-1HTX8S9oB_wz1q-Ij6hsc5Pl8b5QXFzhEBntnFFXKP9rEs-yayfUogqd20QEUyQ
      const wc = new WebhookClient(
        '929818920867745833',
        'rERj-1HTX8S9oB_wz1q-Ij6hsc5Pl8b5QXFzhEBntnFFXKP9rEs-yayfUogqd20QEUyQ'
      );
      const embed = new MessageEmbed()
        .setTitle('New Server Has Been Authorized!')
        .setColor('BLUE')
        .setTimestamp()
        .addFields(
          { name: 'Guild Name:', value: message.guild.name },
          { name: 'Guild ID:', value: message.member.guild.id }
        );
      wc.send({
        username: message.author.tag,
        avatarURL: message.author.displayAvatarURL({ dynamic: true }),
        embeds: [embed],
      });
      const messEmbednow = new MessageEmbed()
        .setTitle(`**Successfully authorized this server!**`)
        .setColor('BLUE')
        .setTimestamp();
      return message.channel.send(messEmbednow);
    }
  },
};

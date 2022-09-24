const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'unban',
  description: 'it does what u think it does',
  permissions: [],
  async execute(message, args) {
    return; // command inactive - bot is currently being used for other purposes
    console.log('tried to unban');
    let person = message.guild.member(message.mentions.members.first());
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      const messEmbednow = new MessageEmbed()
        .setTitle(
          `***${person.user.tag}*** **You do not have permissions to unban** ***${person.user.tag}***`
        )
        .setColor('BLUE')
        .setTimestamp();
      return message.channel.send(messEmbednow);
    } else if (!person.bannable) {
      const messEmbednow = new MessageEmbed()
        .setTitle(`**I do not have permissions to unban** ***${person.user.tag}***`)
        .setColor('BLUE')
        .setTimestamp();
      return message.channel.send(messEmbednow);
    } else if (!args || !args[0].length) {
      const messEmbednow = new MessageEmbed()
        .setTitle(`***${message.author}*** **you have to specify the user you want to unban!**`)
        .setColor('BLUE')
        .setTimestamp();
      return message.channel.send(messEmbednow);
    } else {
      let userId = args[0].toString().replace(/</g, '');
      userId = userId.replace(/!/g, '');
      userId = userId.replace(/>/g, '');
      userId = userId.replace(/@/g, '');

      try {
        const banList = await message.guild.fetchBans();
        const targetId = banList.get(userId).user;
        console.log(targetId);

        if (!targetId) {
          console.log(`${args[0]} is not banned!`);
          const messEmbednow = new MessageEmbed()
            .setTitle(`***${args[0]}*** ** is not banned!**`)
            .setColor('BLUE')
            .setTimestamp();
          return message.channel.send(messEmbednow);
        }
      } catch (err) {
        console.log(err);
        if (!message.guild.member(userId)) {
          const messEmbednow = new MessageEmbed()
            .setTitle(`**There is no user named** ***${args[0]}***`)
            .setColor('BLUE')
            .setTimestamp();
          return message.channel.send(messEmbednow);
        } else {
          const messEmbednow = new MessageEmbed()
            .setTitle(`**User named** ***${args[0]}*** **is not banned!**`)
            .setColor('BLUE')
            .setTimestamp();
          return message.channel.send(messEmbednow);
        }
      }

      console.log(userId);

      message.guild.members
        .unban(userId)
        .then(() => {
          const messEmbednow = new MessageEmbed()
            .setTitle(`**Unbanned ${args[0]}. Welcome back!**`)
            .setColor('BLUE')
            .setTimestamp();
          message.channel.send(messEmbednow);
        })
        .catch(console.error);
      console.log(`Unbanned ${args[0]}`);
    }
  },
};

const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'join',
  description: 'makes the client to join users channel',
  permissions: [],
  async execute(message, args, com, client) {
    const voice_channel = message.member.voice.channel;
    if (hasJoinedChannel.has(message.guild.id)) {
      const messEmbednow = new MessageEmbed()
        .setTitle(`**I'm already in a channel!**`)
        .setColor('BLUE')
        .setTimestamp();
      message.channel.send(messEmbednow);
      return console.log('tried to join but client already in a channel');
    }
    if (!message.member.voice.channel) {
      const messEmbednow = new MessageEmbed()
        .setTitle(
          `***${message.author.tag}*** **you need to be in a voice channel to execute this command!**`
        )
        .setColor('BLUE')
        .setTimestamp();
      return message.channel.send(messEmbednow);
    }

    try {
      voice_channel.join();
      hasJoinedChannel.set(message.guild.id, true);
      console.log('Joined voice channel', voice_channel.name);
    } catch (err) {
      const messEmbednow = new MessageEmbed()
        .setTitle(`**There was an error connecting!**`)
        .setColor('BLUE')
        .setTimestamp();
      message.channel.send(messEmbednow);
      console.log('Connection to channel error.');
      throw err;
    }
  },
};

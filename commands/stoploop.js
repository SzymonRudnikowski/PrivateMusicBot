const discord = require('discord.js');
const songTit = require('./play');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'stoploop',
  aliases: ['sl', 'unloop'],
  description: 'end looped song',
  async execute(message, args, com, client) {
    return; // command inactive - bot is currently being used for other purposes
    const voice_channel = message.member.voice.channel;
    if (!voice_channel) {
      const messEmbednow = new MessageEmbed()
        .setTitle(
          `***${message.author}*** **You need to be in a voice channel to execute this command!**`
        )
        .setColor('BLUE')
        .setTimestamp();
      return message.channel.send(messEmbednow);
    }
    const inSameChannel = client.voice.connections.some(
      (connection) => connection.channel.id === message.member.voice.channelID
    );

    if (!inSameChannel) {
      const messEmbednow = new MessageEmbed()
        .setTitle(`***${message.author}*** **you need to be in the same channel as the bot!**`)
        .setColor('BLUE')
        .setTimestamp();
      return message.channel.send(messEmbednow);
    }
    try {
      if (!YoutubeTitle.has(message.guild.id) || YoutubeTitle.get(message.guild.id).length === 1)
        throw err;
    } catch (err) {
      console.log('loop while no music played');
      const messEmbednow = new MessageEmbed()
        .setTitle(`**No music is currently played!**`)
        .setColor('BLUE')
        .setTimestamp();
      return message.channel.send(messEmbednow);
    }

    if (!looped.get(message.guild.id)) {
      const messEmbednow = new MessageEmbed()
        .setTitle(`****Nothing is looped!**`)
        .setColor('BLUE')
        .setTimestamp();
      return message.channel.send(messEmbednow);
    }
    looped.set(message.guild.id, false);
    console.log('unlooped using stoploop! status: ' + looped.get(message.guild.id));
    const messEmbednow = new MessageEmbed()
      .setTitle(`**Loop ended!**`)
      .setColor('BLUE')
      .setTimestamp();
    return message.channel.send(messEmbednow);
  },
};

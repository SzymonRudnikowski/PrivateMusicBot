const discord = require('discord.js');
const songTit = require('./play');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'clearqueue',
  aliases: ['cq', 'clearq'],
  description: 'clears song queue',
  async execute(message) {
    return; // command inactive - bot is currently being used for other purposes
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
      if (server_queue.songs.length === 1) throw err;
      songTitles.get(message.guild.id).splice(2, songTitles.get(message.guild.id).length - 2);
      server_queue.songs.splice(1, server_queue.songs.length - 1);
      console.log('server queue defined, clearing it');
    } catch (err) {
      console.log('server queue not defined or empty, clearing nothing');
      const messEmbednow = new MessageEmbed()
        .setTitle(`**There is nothing to clear - the queue is empty!**`)
        .setColor('BLUE')
        .setTimestamp();
      return message.channel.send(messEmbednow);
    }

    const messEmbednow = new MessageEmbed()
      .setTitle(`**Queue has been successfully cleared!**`)
      .setColor('BLUE')
      .setTimestamp();
    return message.channel.send(messEmbednow);
  },
};

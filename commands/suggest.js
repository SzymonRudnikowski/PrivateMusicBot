const Discord = require('discord.js');
module.exports = {
  name: 'suggest',
  description: 'Suggestion command',
  permissions: [],
  execute(message, args, cmd, client) {
    return; // command inactive - bot is currently being used for other purposes
    const channel = message.guild.channels.cache.find((c) => c.name === '💡┇suggestions');
    if (!channel) return message.channel.send('Suggestion channel does not exist!');

    let messageArgs = args.join(' ');
    const embed = new Discord.MessageEmbed()
      .setColor('FADF2E')
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(messageArgs)
      .setFooter('!suggest text_here.');

    channel
      .send(embed)
      .then((msg) => {
        msg.react('👍');
        msg.react('👎');
        message.delete();
      })
      .catch((err) => {
        throw err;
      });
  },
};

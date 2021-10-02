const Discord = require("discord.js");

module.exports = {
    name: 'order',
    description: 'open a purchase ticket!',
    aliases: [],
    permissions: [], 
    async execute(message, args, client) {
        const channel = await message.guild.channels.create(`ticket: ${message.author.username}`);
    
    channel.setParent("892179246406045787");

    channel.updateOverwrite(message.guild.id, {
      SEND_MESSAGE: false,
      VIEW_CHANNEL: false,
    });
    channel.updateOverwrite(message.author, {
      SEND_MESSAGE: true,
      VIEW_CHANNEL: true,
    });

    const reactionEmbed = new Discord.MessageEmbed()
            .setColor('0x03f4fc')
            .setTitle('Welcome!')
            .setDescription('**Hi!\n Please describe your order.\n Our staff will reach out to you asap!**')
            .setFooter('If you think your order is finished, please react to with 🔒 or ⛔');

    const reactionMessage = await channel.send(reactionEmbed);

    try {
      await reactionMessage.react("🔒");
      await reactionMessage.react("⛔");
    } catch (err) {
      channel.send("Error sending emojis!");
      throw err;
    }

    const collector = reactionMessage.createReactionCollector(
      (reaction, user) => message.guild.members.cache.find((member) => member.id === user.id).hasPermission("ADMINISTRATOR"),
      { dispose: true }
    );

    collector.on("collect", (reaction, user) => {
      switch (reaction.emoji.name) {
        case "🔒":
          channel.updateOverwrite(message.author, { SEND_MESSAGES: false });
          channel.send("**Ticket owner just closed an order!**");
          break;
        case "⛔":
          channel.send("**Channel will be deleted in 5 seconds.**");
          setTimeout(() => channel.delete(), 5000);
          break;
      }
    });

    message.channel
      .send(`Your ticket is created! ${channel}`)
      .then((msg) => {
        setTimeout(() => msg.delete(), 7000);
        setTimeout(() => message.delete(), 3000);
      })
      .catch((err) => {
        throw err;
      });
    },
};
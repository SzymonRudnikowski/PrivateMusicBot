const Discord = require("discord.js");

const talkedRecently = new Set();


module.exports = {
  name: 'support',
  description: 'open a support ticket!',
  aliases: [],
  permissions: [],
  async execute(message, args, client) {
    if (talkedRecently.has(message.author.id)) {
      return message.channel.send(`**You can only use this command once, wait 1 hour!** ` + `***${message.author}***`);
    } 
      const channel = await message.guild.channels.create(`ticket: ${message.author.username}`);

      channel.setParent("892829064564473886");

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
        .setDescription('**Hi!\n Please describe your problem.\n Our staff will reach out to you asap!**')
        .setFooter('If you think your problem is solved, please react to with 🔒 or ⛔');

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
            channel.send("**Ticket owner just closed an issue!**");
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

        //setting the timeout for 1 hour so that the user can only run this command once and then will have to wait 
        talkedRecently.add(message.author.id);
        setTimeout(() => {
          // Removes the user from the set after an hour
          talkedRecently.delete(message.author.id);
        }, 3600000);
  },
};
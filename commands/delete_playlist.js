const Discord = require('discord.js');
const { TIMEOUT } = require('dns');
const fs = require('fs');

module.exports = {
  name: 'delete_playlist',
  aliases: ['dp'],
  async execute(message, args, com, client) {
    //working
    return; // command inactive - bot is currently being used for other purposes
    if (!args[0] || !args[0].length)
      return message.reply(' **you have to specify the name of the playlist to delete**');

    let guildID = message.guild.id;
    let exist = false;
    console.log(args);
    let playlistName = '';
    for (let i = 0; i < args.length; i++) {
      if (i == args.length - 1) playlistName += args[i];
      else playlistName += args[i] + ' ';
    }

    if (fs.existsSync(`./jsons_playlists/${message.guild.id}.json`)) {
      fs.readFile(`./jsons_playlists/${message.guild.id}.json`, 'utf-8', (err, data) => {
        if (err) {
          console.log('Error while reading the file');
        } else {
          const serverLocal = JSON.parse(data.toString());
          serverLocal[guildID].forEach((playlist) => {
            if (playlist.name == playlistName) {
              exist = true;
            }
          });
        }
      });
    } else {
      return message.channel.send(`**Playlist named** ***${playlistName}*** **does not exist!**`);
    }
    setTimeout(async function () {
      if (!exist)
        return message.channel.send(`**Playlist named** ***${playlistName}*** **does not exist!**`);

      const filter2 = (reaction, user) =>
        ['\u2714'].includes(reaction.emoji.name) && message.author.id == user.id;
      let page = new Discord.MessageEmbed();
      page.setDescription('Are you sure?').setFooter('PMB');

      const Embed = await message.channel.send(page);
      await Embed.react('\u2714'); //here checkmark
      await Embed.react('\u274C'); //here x mark

      let ReactionCol = Embed.createReactionCollector(filter2);

      ReactionCol.on('collect', (reaction) => {
        if (reaction.emoji.name === '\u2714') {
          fs.readFile(`./jsons_playlists/${message.guild.id}.json`, 'utf-8', (err, data) => {
            if (err) {
              console.log('Error reading file', err);
            } else {
              const serverLocal = JSON.parse(data.toString());
              serverLocal[guildID].splice(serverLocal[guildID].indexOf(guildID), 1);
              const serverLocalString = JSON.stringify(serverLocal, null, 4);
              fs.writeFile(
                `./jsons_playlists/${message.guild.id}.json`,
                serverLocalString,
                (err) => {
                  if (err) {
                    console.log('Error writing file', err);
                  } else {
                    console.log(`deleted playlist: ${playlistName}`);
                  }
                }
              );
            }
          });
          Embed.delete();
          return message.channel.send(`**Playlist** ***${playlistName}*** **has been removed**`);
        } else if (reaction.emoji.name === '\u274C') {
          console.log('deleting the playlist canceled');
          Embed.delete();
        }
      });
    }, 1000);
  },
};

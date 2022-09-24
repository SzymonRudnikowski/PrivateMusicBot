const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'create_playlist',
  aliases: ['cp'],
  async execute(message, args, com, client) {
    return; // command inactive - bot is currently being used for other purposes
    let exist = false;
    let good = true;
    //working
    if (!args[0] || !args[0].length)
      return message.reply(' **you have to specify the name of the playlist to create**');
    args.forEach((element) => {
      if (element.indexOf(',') !== -1) {
        good = false;
      }
    });
    if (!good) return message.reply(" **you can't use a comma sign inside the playlist name!**");

    let guildID = message.guild.id;
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
              message.channel.send(`**Playlist named** *** ${args[0]}*** ** already exists!**`);
            }
          });
        }
      });
    }

    setTimeout(() => {
      console.log(exist);
      if (!exist) {
        console.log('asd');
        let playlist = {
          name: playlistName,
          size: 0,
          total_length: 0,
          songs: [],
        };

        let server = {
          [guildID]: [],
        };
        const jsonString = JSON.stringify(server, null, 4);

        if (!fs.existsSync(`./jsons_playlists/${message.guild.id}.json`)) {
          fs.writeFile(`./jsons_playlists/${message.guild.id}.json`, jsonString, (err) => {
            if (err) {
              console.log('Error writing file', err);
            } else {
              console.log('created file');
            }
          });
        }

        fs.readFile(`./jsons_playlists/${message.guild.id}.json`, 'utf-8', (err, data) => {
          if (err) {
            console.log('Error reading file', err);
          } else {
            const serverLocal = JSON.parse(data.toString());
            serverLocal[guildID].push(playlist);
            const serverLocalString = JSON.stringify(serverLocal, null, 4);
            fs.writeFile(`./jsons_playlists/${message.guild.id}.json`, serverLocalString, (err) => {
              if (err) {
                console.log('Error writing file', err);
              } else {
                console.log(`created playlist: ${playlistName}`);
              }
            });
          }
        });

        return message.channel.send('**Playlist created!**');
      }
    }, 1000);
  },
};

const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'playlist_songremove',
  aliases: ['pr'],
  async execute(message, args, com, client) {
    //working
    return; // command inactive - bot is currently being used for other purposes
    if (args.join().indexOf('/') === -1)
      return message.reply(' **syntax you entered is not valid! (valid syntax under !help)**');
    let song_name = args
      .join()
      .substr(args.join().indexOf('/') + 1, args.join().length)
      .replace(/,/g, ' ');
    console.log(song_name);

    let playlistName = args.join().substr(0, args.join().indexOf('/')).replace(/,/g, ' ');
    console.log(playlistName);
    if (!playlistName.length)
      return message.reply(
        ' **you have to specify the name of the playlist you want a song to remove**'
      );
    if (!song_name.length)
      return message.reply(' **you have to specify the name of the song you want to remove**');

    let exist = false;
    let guildID = message.guild.id;

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

      fs.readFile(`./jsons_playlists/${message.guild.id}.json`, 'utf-8', (err, data) => {
        let song_exist = true;
        if (err) {
          console.log('Error while reading the file');
        } else {
          const serverLocal = JSON.parse(data.toString());
          serverLocal[guildID].forEach((playlist) => {
            if (playlist.name == playlistName) {
              if (!playlist.songs.length) song_exist = false;
              else {
                for (let i = 0; i < playlist.songs.length; i++) {
                  let song = playlist.songs[i];
                  if (playlist.songs[i].title === song_name) {
                    playlist.songs.splice(i, 1);
                    playlist.total_length -= song.length;
                    playlist.size--;
                    break;
                  }
                  if (i == playlist.songs.length - 1) {
                    song_exist = false;
                  }
                }
              }

              return;
            }
          });
          const return_string = JSON.stringify(serverLocal, null, 4);
          if (!song_exist) {
            const messEmbediss = new Discord.MessageEmbed()
              .setTitle(
                `**Song** ***${song_name}*** **does not exist in playlist** ***${playlistName}***`
              )
              .setColor('PURPLE');
            return message.channel.send(messEmbediss);
          }
          fs.writeFile(`./jsons_playlists/${message.guild.id}.json`, return_string, (err) => {
            if (err) {
              console.log('Error writing file', err);
            } else {
              const messEmbediss = new Discord.MessageEmbed()
                .setTitle(
                  `**👍** ***${song_name}*** **deleted from playlist** ***${playlistName}***`
                )
                .setColor('PURPLE');
              message.channel.send(messEmbediss);
              console.log(`deleted song: ${song_name} from playlist: ${playlistName}`);
            }
          });
        }
      });
    }, 1000);
  },
};

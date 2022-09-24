const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const fs = require('fs');

module.exports = {
  name: 'playlistsong_add',
  aliases: ['pa'],
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
        ' **you have to specify the name of the playlist you want a song to add in**'
      );
    if (!song_name.length)
      return message.reply(' **you have to specify the name of the song you want to add in**');

    let exist = false;
    let guildID = message.guild.id;
    let song = { title: '', url: '', length: '' };

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

      if (ytdl.validateURL(song_name)) {
        const song_info = await ytdl.getInfo(song_name);
        song = {
          title: song_info.videoDetails.title,
          url: song_info.videoDetails.video_url,
          length: song_info.videoDetails.lengthSeconds,
        };

        console.log('arg is a link');
      } else {
        //If there was no link, we use keywords to search for a video. Set the song object to have two keys. Title and URl.
        const video_finder = async (query) => {
          const video_result = await ytSearch(query);
          return video_result.videos.length > 1 ? video_result.videos[0] : null;
        };
        const video = await video_finder(song_name);
        if (video) {
          let length_formatted = video.duration.timestamp;
          length_formatted = length_formatted.split(':');
          let power = 0;
          length_formatted.reverse();
          let current_sec_number = 0;
          for (let i = 0; i < length_formatted.length; i++) {
            current_sec_number += length_formatted[i] * Math.pow(60, power);
            power++;
          }
          console.log(length_formatted);
          console.log(current_sec_number);

          song = { title: video.title, url: video.url, length: current_sec_number, index: null };
        } else {
          message.channel.send('Error while finding the video.');
          console.log('Error while finding video.');
        }
        console.log('arg is not a link');
      }

      fs.readFile(`./jsons_playlists/${message.guild.id}.json`, 'utf-8', (err, data) => {
        if (err) {
          console.log('Error while reading the file');
        } else {
          const serverLocal = JSON.parse(data.toString());
          serverLocal[guildID].forEach((playlist) => {
            if (playlist.name == playlistName) {
              playlist.size++;
              song.index = playlist.size;
              playlist.songs.push(song);

              playlist.total_length += song.length;

              return;
            }
          });
          const return_string = JSON.stringify(serverLocal, null, 4);
          fs.writeFile(`./jsons_playlists/${message.guild.id}.json`, return_string, (err) => {
            if (err) {
              console.log('Error writing file', err);
            } else {
              const messEmbediss = new Discord.MessageEmbed()
                .setTitle(`**👍** ***${song.title}*** **added to playlist** ***${playlistName}***`)
                .setColor('PURPLE');
              message.channel.send(messEmbediss);
              console.log(`added song: ${song.title} into playlist: ${playlistName}`);
            }
          });
        }
      });
    }, 1000);
  },
};

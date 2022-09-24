const Discord = require('discord.js');
const { WebhookClient, MessageEmbed } = require('discord.js');
const fs = require('fs');

global.playlistPlayType = new Map();
//musze to przemyslec dobrze
//jak to zrobic bo musi byc jedna duza kolejka do wszystkiego, moznaby np stworzyc liste osobna dla playlisty ktora bysmy chcieli
//i nastepnie w zaleznosci od opcji ja ustawiac

module.exports = {
  name: 'playlistplay_song',
  aliases: ['pps'],
  async execute(message, args, com, client) {
    return; // command inactive - bot is currently being used for other purposes
    const voice_channel = message.member.voice.channel;
    //if (!voice_channel) return message.channel.send(`${message.author} ***You need to be in a voice channel to execute this command!***`);

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
        ' **you have to specify the name of the playlist you want to play a song from**'
      );
    if (!song_name.length)
      return message.reply(' **you have to specify the name of the song you want to play**');

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

    setTimeout(() => {
      if (!exist)
        return message.channel.send(`**Playlist named** ***${playlistName}*** **does not exist!**`);

      fs.readFile(`./jsons_playlists/${message.guild.id}.json`, 'utf-8', (err, data) => {
        if (err) {
          console.log('Error while reading the file');
        } else {
          const serverLocal = JSON.parse(data.toString());
          serverLocal[guildID].forEach((playlist) => {
            if (playlist.name == playlistName) {
              play_from_playlist(message, serverLocal);
            }
          });
        }
      });
    }, 1000);
  },
};

const play_from_playlist = async (message, serverLocal) => {
  try {
    if (YoutubeTitle.get(message.guild.id).length === 1) throw 1;
    const inSameChannel = client.voice.connections.some(
      (connection) => connection.channel.id === message.member.voice.channelID
    );
    if (!inSameChannel && client.voice.connections.size)
      return message.reply('** you need to be in the same channel as the bot!**');
    server_queue.songs.push(song);
    console.log(`${song.title} added to queue!`);
    const messEmbed = new MessageEmbed()
      .setTitle(`👍 ***${song.title}*** added to queue!`)
      .setColor('PURPLE')
      .setFooter(`[Requested by ${message.author.tag}]`, message.author.displayAvatarURL);

    //LOGS SYSTEM SETUP
    const wc = new WebhookClient(
      '929495033365819402',
      'ntIE1kywkXZ6_oeBhrDVYiYxIa-Ml69Up5Teed0TKdRyoTi2JPP6zBhE_TlHlCYG7Um-'
    );
    const embed = new MessageEmbed()
      .setTitle(`${song.title} added to queue!`)
      .setColor('PURPLE')
      .setTimestamp()
      .addFields(
        { name: 'Guild Name:', value: message.guild.name },
        { name: 'Voice Channel', value: voice_channel.name }
      );
    wc.send({
      username: message.author.tag,
      avatarURL: message.author.displayAvatarURL({ dynamic: true }),
      embeds: [embed],
    });
    return message.channel.send(messEmbed);
  } catch (err) {
    global.queue_constructor = {
      voice_channel: voice_channel,
      text_channel: message.channel,
      connection: null,
      songs: [],
    };

    const wc = new WebhookClient(
      '929495033365819402',
      'ntIE1kywkXZ6_oeBhrDVYiYxIa-Ml69Up5Teed0TKdRyoTi2JPP6zBhE_TlHlCYG7Um-'
    );
    const embed = new MessageEmbed()
      .setTitle(`${song.title} issued this song!`)
      .setColor('GREEN')
      .setTimestamp()
      .addFields(
        { name: 'Guild Name:', value: message.guild.name },
        { name: 'Voice Channel', value: voice_channel.name }
      );
    wc.send({
      username: message.author.tag,
      avatarURL: message.author.displayAvatarURL({ dynamic: true }),
      embeds: [embed],
    });
    //Add our key and value pair into the global queue. We then use this to get our server queue.
    queue.set(message.guild.id, queue_constructor);
    queue_constructor.songs.push(song);

    //Establish a connection and play the song with the video_player function.
    try {
      const connection = await voice_channel.join();
      console.log('Joined voice channel', voice_channel.name);
      hasJoinedChannel.set(message.guild.id, true);
      queue_constructor.connection = connection;
      video_player(message.guild, queue_constructor.songs[0]);
      const wc = new WebhookClient(
        '929817046164832337',
        '3J4GfuLhWYS7QOve7RVzpja3ZMyD7gBcGLSbfTtkllMUa_u1LhINCjgobJljW_e2kEfu'
      );
      const embed = new MessageEmbed()
        .setTitle('Queue Started! Joining the channel.')
        .setColor('GREEN')
        .setTimestamp()
        .addFields({ name: 'Voice Channel', value: voice_channel.name });
      wc.send({
        username: 'Logs',
        embeds: [embed],
      });
    } catch (err) {
      queue.delete(message.guild.id);
      message.channel.send('There was an error connecting!');
      console.log('Connection to channel error.');
      throw err;
    }
  }
};

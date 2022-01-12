const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    name: 'add_playlist_song',
    aliases: ['aps'],
    async execute(message, args, com, client) {
        //not working
        if (!args[0] || !args[0].length) return message.reply(' **you have to specify the name of the playlist you want a song to add**');
        if (!args[1] || !args[1].length) return message.reply(' **you have to specify the name of the song you want to add**');
        let exists = false;

        if (ServerPlaylists.has(message.guild.id)) {
            ServerPlaylists.get(message.guild.id).forEach(playlist => {
                if (playlist.name == args[0]) exists = true;
            });

            if (!exists) return message.channel.send(`**Playlist named** ***${args[0]}*** **does not exist!**`);
        } else return message.channel.send(`**Playlist named** ***${args[0]}*** **does not exist!**`);

        if (ytdl.validateURL(args[0])) {
            const song_info = await ytdl.getInfo(args[0]);
            let video_length_formatted = "";
            let len_sec = song_info.videoDetails.lengthSeconds;

            if (len_sec / 60 / 60 < 10) video_length_formatted += "0" + Math.floor(len_sec / 60 / 60) + ":";
            else video_length_formatted += Math.floor(len_sec / 60 / 60) + ":";

            if (len_sec / 60 % 60 < 10) video_length_formatted += "0" + Math.floor(len_sec / 60 % 60) + ":";
            else video_length_formatted += Math.floor(len_sec / 60 % 60) + ":";

            if (len_sec % 60 < 10) video_length_formatted += "0" + Math.floor(len_sec % 60);
            else video_length_formatted += Math.floor(len_sec % 60);

            song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url, length: video_length_formatted }

            console.log("arg is a link")
        } else {
            //If there was no link, we use keywords to search for a video. Set the song object to have two keys. Title and URl.
            const video_finder = async(query) => {
                const video_result = await ytSearch(query);
                return (video_result.videos.length > 1) ? video_result.videos[0] : null;
            }
            const video = await video_finder(args.join(' '));
            if (video) {
                song = { title: video.title, url: video.url, length: video.duration.timestamp }
            } else {
                message.channel.send('Error while finding the video.');
                console.log('Error while finding video.')
            }
            console.log("arg is not a link")
        }

        
    },
};
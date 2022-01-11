const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    name: 'add_playlist_song',
    aliases: ['aps'],
    async execute(message, args, com, client) {
        if (!args[0] || !args[0].length) return message.reply(' **you have to specify the name of the playlist you want a song to remove**');
        if (!args[1] || !args[1].length) return message.reply(' **you have to specify the name of the song you want to remove**');
        let exists = false;

        if (ServerPlaylists.has(message.guild.id)) {
            ServerPlaylists.get(message.guild.id).forEach(playlist => {
                if (playlist.name == args[0]) exists = true;
            });

            if (!exists) return message.channel.send(`**Playlist named** ***${args[0]}*** **does not exist!**`);
        } else return message.channel.send(`**Playlist named** ***${args[0]}*** **does not exist!**`);


    },
};
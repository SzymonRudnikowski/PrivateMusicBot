const Discord = require("discord.js");

global.ServerPlaylists = new Map();

module.exports = {
    name: 'create_playlist',
    aliases: ['cp'],
    async execute(message, args, com, client) {
        if (!args[0] || !args[0].length) return message.reply(' **you have to specify the name of the playlist to create**');
        let exist = false;
        if (ServerPlaylists.has(message.guild.id)) {
            ServerPlaylists.get(message.guild.id).forEach(playlist => {
                if (playlist.name == args[0]) {
                    message.channel.send(`**Playlist named** *** ${args[0]}*** ** already exists!**`);
                    exist = true;
                }

            });
        }
        if (exist) return;

        let playlist = {
            name: args[0],
            size: 0,
            total_length: 0,
            songs: [],
        }

        let playlist_list = [];

        if (!ServerPlaylists.has(message.guild.id)) {
            playlist_list.push(playlist);
            console.log(`first playlist created ${playlist.name}`)
            ServerPlaylists.set(message.guild.id, playlist_list);
        } else {
            console.log(`new playlist created ${playlist.name}`)
            ServerPlaylists.get(message.guild.id).push(playlist);
        }
        return message.channel.send("**Playlist created!**")
    },
};
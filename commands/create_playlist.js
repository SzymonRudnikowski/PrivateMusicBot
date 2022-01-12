const Discord = require("discord.js");
const fs = require('fs');

module.exports = {
    name: 'create_playlist',
    aliases: ['cp'],
    async execute(message, args, com, client) {
        //working
        if (!args[0] || !args[0].length) return message.reply(' **you have to specify the name of the playlist to create**');
        let exist = false;
        try{
            fs.readFile("playlists.json", "utf-8", function(err, json) {
                if(err) throw err;
                try{
                    let playlist_exist = json[message.guild.id][args[0]];
                    message.channel.send(`**Playlist named** *** ${args[0]}*** ** already exists!**`);
                    exist = true;
                }catch(err){
                    console.log("playlist ok (create)")
                }
            })
        }
        catch(err){
            console.log(err)
            return message.channel.send("**An error occurred while creating a playlist!**");
        }

        if (!exist) {
            let playlist = {
                name: args[0],
                size: 0,
                total_length: "0:00",
                songs: [],
            }

            let playlist_list = [];

            

            // if (!ServerPlaylists.has(message.guild.id)) {
            //     playlist_list.push(playlist);
            //     console.log(`first playlist created ${playlist.name}`)
            //     ServerPlaylists.set(message.guild.id, playlist_list);
            // } else {
            //     console.log(`new playlist created ${playlist.name}`)
            //     ServerPlaylists.get(message.guild.id).push(playlist);
            // }
            // return message.channel.send("**Playlist created!**")
        }
    },
};
const Discord = require("discord.js");
const fs = require("fs");
const play_playlistsong = require("./play_playlistsong");

global.playlistPlayType = new Map();

module.exports = {
    name: 'playplaylist',
    aliases: ['pp'],
    async execute(message, args, com, client) {
        const voice_channel = message.member.voice.channel;
        //if (!voice_channel) return message.channel.send(`${message.author} ***You need to be in a voice channel to execute this command!***`);

        if (args.join().indexOf('/') === -1) return message.reply(' **syntax you entered is not valid! (valid syntax under !help)**')
        let play_type = args.join().substr(args.join().indexOf('/') + 1, args.join().length).replace(/,/g, ' ');
        console.log(play_type);

        let playlistName = args.join().substr(0, args.join().indexOf('/')).replace(/,/g, ' ');
        console.log(playlistName);
        if (!playlistName.length) return message.reply(' **you have to specify the name of the playlist you want to play**');
        if (!play_type.length) return message.reply(' **you have to specify the way of playing your playlist (repeat/shuffle)**');
        if (play_type !== "shuffle" && play_type !== "repeat" && play_type !== "none") return message.reply(` **there is no such an option (${play_type})**`)

        let exist = false;
        let guildID = message.guild.id;
        if (!playlistPlayType.has(guildID)) playlistPlayType.set(guildID, "none");

        if (fs.existsSync(`./jsons_playlists/${message.guild.id}.json`)) {
            fs.readFile(`./jsons_playlists/${message.guild.id}.json`, 'utf-8', (err, data) => {
                if (err) {
                    console.log('Error while reading the file');
                } else {
                    const serverLocal = JSON.parse(data.toString());
                    serverLocal[guildID].forEach(playlist => {
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
            if (!exist) return message.channel.send(`**Playlist named** ***${playlistName}*** **does not exist!**`);

            fs.readFile(`./jsons_playlists/${message.guild.id}.json`, 'utf-8', (err, data) => {
                if (err) {
                    console.log('Error while reading the file');
                } else {
                    const serverLocal = JSON.parse(data.toString());
                    serverLocal[guildID].forEach(playlist => {
                        if (playlist.name == playlistName) {
                            switch (play_type) {
                                case "shuffle":
                                    {
                                        if (!songTitles.has(message.guild.id) || songTitles.get(message.guild.id).length === 1) {

                                        }
                                        break;
                                    }
                                case "repeat":
                                    {
                                        if (!songTitles.has(message.guild.id) || songTitles.get(message.guild.id).length === 1) {

                                        }
                                        break;
                                    }
                                case "none":
                                    {
                                        playlistPlayType.set(guildID, "none");
                                        break;
                                    }

                            }
                        }
                    });
                }

            });

        }, 1000);
    },
};
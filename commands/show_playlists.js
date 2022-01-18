const Discord = require("discord.js");
const fs = require('fs');

module.exports = {
    name: 'show_playlists',
    aliases: ['sp', 'showp', 'playlists'],
    async execute(message, args, com, client) {
        //working
        if (!args || !args.join().length) {
            let page = new Discord.MessageEmbed();
            let page_text = "";
            let count = 1;
            let guildID = message.guild.id;

            if (fs.existsSync(`./jsons_playlists/${message.guild.id}.json`)) {
                fs.readFile(`./jsons_playlists/${message.guild.id}.json`, 'utf-8', (err, data) => {
                    if (err) {
                        console.log('Error while reading the file');
                    } else {
                        const serverLocal = JSON.parse(data.toString());
                        if (!serverLocal[guildID].length) page_text = "Empty";
                        else {
                            serverLocal[guildID].forEach(playlist => {
                                page_text += count + '. ' + playlist.name + ' \u2022 ' + playlist.size + (playlist.size == 1 ? 'song, ' : ' songs, ');
                                let len_sec = playlist.total_length;

                                if (len_sec >= 3600) {
                                    page_text += Math.floor(len_sec / 60 / 60) + 'hr ';
                                }
                                page_text += Math.floor(len_sec / 60 % 60) + 'min';
                                page_text += '\n'
                                count++;
                            });
                        }
                    }

                });
            } else {
                page_text = "Empty"
            }

            setTimeout(() => {
                page.setColor('0x03f4fc')
                    .setTitle('**Playlists: **')
                    .setDescription(page_text)
                    .setFooter('PMB');
                return message.channel.send(page);
            }, 1000);
        } else {
            let page = new Discord.MessageEmbed();
            let page_text = "";
            let count = 1;
            let guildID = message.guild.id;
            let playlistName = args.join(' ');
            let exist = false;
            console.log(playlistName);
            if (!playlistName.length) return message.reply(" **you need to specify the name of the playlist you want to see the content of!**");

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
                        if (!serverLocal[guildID].length) page_text = "Empty";
                        else {
                            serverLocal[guildID].forEach(playlist => {
                                if (playlist.name === playlistName) {
                                    if (!playlist.songs.length) page_text = "Empty";
                                    else {
                                        playlist.songs.forEach(song => {
                                            let song_length_formatted = "";
                                            let len_sec = song.length;

                                            if (len_sec >= 3600) {
                                                if (len_sec / 60 / 60 < 10) song_length_formatted += "0" + Math.floor(len_sec / 60 / 60) + ":";
                                                else song_length_formatted += Math.floor(len_sec / 60 / 60) + ":";
                                            }

                                            song_length_formatted += Math.floor(len_sec / 60 % 60) + ":";

                                            if (len_sec % 60 < 10) song_length_formatted += "0" + Math.floor(len_sec % 60);
                                            else song_length_formatted += Math.floor(len_sec % 60);

                                            page_text += `${count}. ${song.title} (${song_length_formatted})\n`;
                                            count++;
                                        });
                                    }

                                    return;
                                }
                            });
                        }
                    }

                });

                setTimeout(() => {
                    page.setColor('0x03f4fc')
                        .setTitle(`***${playlistName}'s*** **songs: **`)
                        .setDescription(page_text)
                        .setFooter('PMB');
                    return message.channel.send(page);
                }, 500);
            }, 1000);
        }
    },
};
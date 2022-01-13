const Discord = require("discord.js");
const fs = require('fs');

module.exports = {
    name: 'show_playlists',
    aliases: ['sp', 'showp', 'playlists'],
    async execute(message, args, com, client) {
        //working
        let page = new Discord.MessageEmbed();
        let page_text = "";
        let count = 1;
        let guildID = message.guild.id;

        if(fs.existsSync(`./jsons_playlists/${message.guild.id}.json`)){
            fs.readFile(`./jsons_playlists/${message.guild.id}.json`, 'utf-8', (err, data) => {
                if (err) {
                    console.log('Error while reading the file');
                } else {
                    const serverLocal = JSON.parse(data.toString());
                    if(!serverLocal[guildID].length) page_text = "Empty";
                    else{
                        serverLocal[guildID].forEach(playlist => {
                            page_text += count + '. ' + playlist.name + ' \u2022 ' + playlist.size + (playlist.size == 1? 'song, ' : ' songs, ');
                            let len_sec = playlist.total_length;
                            if(len_sec == 0)
    
                            page_text += Math.floor(len_sec / 60 / 60) + 'hr ';
                            page_text += Math.floor(len_sec / 60 % 60) + 'min';
                            page_text += '\n'
                            count++;
                        });
                    }
                }
                
            });
        }else{
            page_text = "Empty"
        }

        setTimeout(() => {
            page.setColor('0x03f4fc')
            .setTitle('**Playlists: **')
            .setDescription(page_text)
            .setFooter('PMB');
            return message.channel.send(page);
        }, 1000);
    },
};
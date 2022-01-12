const Discord = require("discord.js");
const fs = require('fs');

module.exports = {
    name: 'create_playlist',
    aliases: ['cp'],
    async execute(message, args, com, client) {
        var exist = false;
        //working
        if (!args[0] || !args[0].length) return message.reply(' **you have to specify the name of the playlist to create**');
       
        let guildID = message.guild.id;

        if(fs.existsSync(`./jsons_playlists/${message.guild.id}.json`)){
            fs.readFile(`./jsons_playlists/${message.guild.id}.json`, 'utf-8', (err, data) => {
                if (err) {
                    console.log('Error reading file', err)
                } else {
                    const serverLocal = JSON.parse(data.toString());
                    serverLocal[guildID].forEach(playlist => {
                        if(playlist.name == args[0]){
                            message.channel.send(`**Playlist named** *** ${args[0]}*** ** already exists!**`);
                            exist = true;
                        }
                        
                    });
                }
                
            });
        }
        //POKURWIONE TO JEST, EXIST NIE ZMIENIA WARTOSCI KUJRWA
        

        if (!exist) {
            
            let playlist = {
                name: args[0],
                size: 0,
                total_length: 0,
                songs: [],
            }

            

            let server = {
                [guildID]: []
            }
            const jsonString = JSON.stringify(server, null, 4);
            
            if(!fs.existsSync(`./jsons_playlists/${message.guild.id}.json`)) {
                fs.writeFileSync(`./jsons_playlists/${message.guild.id}.json`, jsonString, err => {
                    if (err) {
                        console.log('Error writing file', err)
                    }else{
                        console.log("created file")
                    }
                });     
            }
            fs.readFile(`./jsons_playlists/${message.guild.id}.json`, 'utf-8', (err, data) => {
                if (err) {
                    console.log('Error reading file', err)
                } else {
                    const serverLocal = JSON.parse(data.toString());
                    serverLocal[guildID].push(playlist);
                    const serverLocalString = JSON.stringify(serverLocal, null, 4);
                    fs.writeFile(`./jsons_playlists/${message.guild.id}.json`,serverLocalString , err => {
                        if (err) {
                            console.log('Error writing file', err)
                        }else{
                            console.log(`created playlist: ${playlist.name}`)
                        }
                    });
                }
            });
            return message.channel.send("**Playlist created!**")
            
        
        // try{console.log(`first playlist created ${playlist.name}`)
                
        //     console.log(`new playlist created ${playlist.name}`)
        //     ServerPlaylists.get(message.guild.id).push(playlist);
        // }catch(err){
            
        }
    },
};
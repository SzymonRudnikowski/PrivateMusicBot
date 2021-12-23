const fs = require("fs");
const Discord = require("discord.js");
module.exports = {
    name: 'auth',
    description: 'guild authorization',
    execute(message, args) {
        if(message.author.id === '391983289122029578' || message.author.id === '259046058737270784' || message.author.id === '403246346745675787'){
            
            const serwis = {
                name: message.member.guild.name,
                id: message.member.guild.id,
                time: "future",
            }
            
            const jsonString = JSON.stringify(serwis, null, 2)
            
            if(fs.existsSync(`./jsons/${message.member.guild.id}.json`)) {
                return message.channel.send("**This server is already authorized!**");
            }
            
            if(!fs.existsSync(`./jsons/${message.member.guild.id}.json`)) {
                console.log('Auhtorized new guild',message.member.guild.name)
                
                fs.writeFileSync(`./jsons/${message.member.guild.id}.json`, jsonString, err => {
                
                    if (err) {
                        console.log('Error writing file', err)
                    } else {
                        console.log('Successfully wrote file')
                        
                    }
                });

                return message.channel.send('**Successfully authorized this server!**');
            }   
        }
        
    },
};
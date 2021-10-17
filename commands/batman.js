const Discord = require("discord.js");
module.exports = {
    name: 'batman',
    description: 'who? cares',
    execute(message) {
        if(message.author.id === '391983289122029578' || message.author.id === '259046058737270784' || message.author.id === '403246346745675787'){
            console.log('Batman begins');
            return process.exit(22);
        }
        
    },
};
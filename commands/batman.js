const Discord = require("discord.js");
module.exports = {
    name: 'batman',
    description: 'Wiadomosc embed',
    execute(message, args) {
        console.log('Batman begins');

        return process.exit(22);
    },
};
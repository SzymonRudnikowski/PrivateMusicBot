const Discord = require("discord.js");
module.exports = {
    name: 'embed',
    description: 'Wiadomosc embed',
    execute(message, args) {
        console.log('Batman begins');

        process.on('exit', function(code) {
        return console.log(`About to exit with code ${code}`);
        });
    },
};
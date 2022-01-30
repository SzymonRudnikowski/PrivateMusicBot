const Discord = require("discord.js");
module.exports = {
    name: 'help_mle',
    description: 'Help commands for the MLE server',
    execute(message, args) {
        const help = new Discord.MessageEmbed()
            .setColor('0x03f4fc')
            .setTitle('List of commands for the MLE server:')
            .setDescription('**!ff name winning team/name losing team - (win/lose by walkover; admin only) \n !current_queue - displays current queue number \n !set_queue - sets the number of the current queue (admin only) \n !resume_stats - enables sending game stats (admin only) \n !stop_stats - disables sending game stats (admin only) \n !score - sends stats of the game and updates the database**')
            .setFooter('PMB - v1.0');

        return message.channel.send(help);
    },
};
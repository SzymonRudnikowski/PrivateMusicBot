const Discord = require("discord.js");
module.exports = {
    name: 'help_mle',
    description: 'Help commands for the MLE server',
    execute(message, args) {
        if (message.guild.id !== '914969283661037618') return;
        const help = new Discord.MessageEmbed()
            .setColor('0x03f4fc')
            .setTitle('List of commands for the MLE server:')
            .setDescription('**!walkover name winning team/name losing team - win/lose by walkover (admin only) \n \n !current_queue - displays current queue number \n \n !set_queue - sets the number of the current queue (admin only) \n \n !resume_stats - enables sending game stats (admin only) \n \n !stop_stats - disables sending game stats (admin only) \n \n !scorecs - sends stats of the game and updates the database \n \n !win name winning team - every player from given team gets 3 kills (admin only)**')
            .setFooter('PMB - v1.0');

        return message.channel.send(help);
    },
};
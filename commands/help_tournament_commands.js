const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help_mle',
	description: 'Help commands for the MLE server',
	execute(message, args) {
		if (message.guild.id !== '914969283661037618') return;
		if (!message.member.hasPermission(['ADMINISTRATOR'])) {
			const messEmbednow = new MessageEmbed()
				.setTitle(`***${message.author.tag}*** **you don't have permissions to execute this command!**`)
				.setColor('RED')
				.setTimestamp();
			return message.channel.send(messEmbednow);
		}

		const help = new Discord.MessageEmbed()
			.setColor('0x03f4fc')
			.setTitle('List of commands for the MLE server:')
			.addFields(
				{
					name: '***Counter-Strike: Global Offensive***',
					value: '!walkover_csgo name winning team/name losing team - win/lose by walkover (admin only) \n \n !current_queue_csgo - displays current queue number \n \n !set_queue_csgo - sets the number of the current queue (admin only) \n \n !resume_stats_csgo - enables sending game stats (admin only) \n \n !stop_stats_csgo - disables sending game stats (admin only) \n \n !score_csgo - sends stats of the game and updates the database \n \n !win_csgo name winning team - every player from given team gets 3 kills (admin only) \n \n !match_result_csgo team_name;score;score;team_name (score - number 0/1 indicating which of the following teams won, if there has been a draw both, teams lost i.e. 0;0)',
				},
				{ name: '\u200B', value: '\u200B' },
				{
					name: '***League of Legends***',
					value: '!walkover_lol name winning team/name losing team - win/lose by walkover (admin only) \n \n !current_queue_lol - displays current queue number \n \n !set_queue_lol - sets the number of the current queue (admin only) \n \n !resume_stats_lol - enables sending game stats (admin only) \n \n !stop_stats_lol - disables sending game stats (admin only) \n \n !score_lol - sends stats of the game and updates the database \n \n !win_lol name winning team - every player from given team gets 3 kills and 5.0 cs/min (admin only) \n \n !match_result_lol team_name;score;score;team_name (score - number 0/1 indicating which of the following teams won, if there has been a draw both, teams lost i.e. 0;0)',
				},
				{ name: '\u200B', value: '\u200B' },
				{
					name: '***Valorant***',
					value: '!match_result_val team_name;score;score;team_name (score - number 0/1 indicating which of the following teams won, if there has been a draw, both teams lost i.e. 0;0)',
				}
			)
			.setFooter('PMB - v1.0');

		return message.channel.send(help);
	},
};

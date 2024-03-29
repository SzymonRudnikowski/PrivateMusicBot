const Discord = require('discord.js');
module.exports = {
	name: 'help',
	description: 'Help command embed',
	execute(message, args) {
		//return; // command inactive - bot is currently being used for other purposes
		const help = new Discord.MessageEmbed()
			// Kolor
			.setColor('0x03f4fc')
			// Tytul
			.setTitle('List of all commands:')
			// Tekst, enter = \n
			.setDescription(
				'**!play/!p - plays given audio. \n \n !skip/!s - skips current song, and plays the next position from queue (Voting system). \n \n !forceskip/!fs - forces a skip of current song, and plays the next position from queue (only for admins and DJs). \n \n !leave/!dc/!dsc - causes bot to leave current voice channel. \n \n !lyrics/!l - Shows lyrics of song that is playing at the moment. \n \n !lyrics/!l + Song_Name - for a given song displays lyrics only. \n \n !clear/!c/!cl - deletes 100 messages from the current channel. \n \n !loop/!lp - loops current song if there is one. \n \n !stoploop/!unloop/!sl - removes current song from a loop. \n \n !queueremove/!queue_remove/!qr - removes given position from queue. \n \n !clearqueue/!cq/!clearq - clears song queue if exists. \n \n !queue/!q - shows songs in queue (max 10). \n \n !ban @user - bans given user from the server. (bot has to be an admin) \n \n !unban @user - removes user from banned list. (bot has to be an admin) \n \n !kick @user - kicks given user from the server. (bot has to be an admin) \n \n !contact - our discord server. \n \n**'
			)
			/// Wiele pol do dodania (opcjonalne - zakomendtowane)
			// .addFields(
			//     {name: '', value: ''},
			//     {name: '', value: ''}
			// )
			.setFooter('PMB - v1.0');

		message.channel.send(help);
	},
};

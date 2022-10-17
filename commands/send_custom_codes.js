const Discord = require('discord.js');
module.exports = {
	name: 'send_custom_codes',
	permissions: [],
	async execute(message, args, com, client) {
		if (message.guild.id !== '914969283661037618') return;
		if (!message.member.hasPermission(['ADMINISTRATOR'])) {
			const messEmbednow = new MessageEmbed()
				.setTitle(`***${message.author.tag}*** **you don't have permissions to execute this command!**`)
				.setColor('RED')
				.setTimestamp();
			return message.channel.send(messEmbednow);
		}
	},
};

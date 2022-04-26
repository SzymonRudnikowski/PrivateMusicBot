const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'clear',
	aliases: ['c', 'cl'],
	decription: 'deletes all message in a channel',
	async execute(message, args, com, client) {
		if (!message.member.hasPermission(['ADMINISTRATOR'])) {
			const messEmbednow = new MessageEmbed()
				.setTitle(`***${message.author.tag}*** **you don't have permissions to execute this command!**`)
				.setColor('RED')
				.setTimestamp();
			return message.channel.send(messEmbednow);
		}

		let number;
		if (!args[0]) number = 25 << 2;
		else {
			if (args[0] < 1 || args[0] > 100) {
				const messEmbednow = new MessageEmbed()
					.setTitle(`**The number of messages to delete must be between 1 and 100 inclusive**`)
					.setColor('BLUE')
					.setTimestamp();
				return message.channel.send(messEmbednow);
			}
			number = args[0];
		}
		if (isNaN(number)) {
			const messEmbednow = new MessageEmbed()
				.setTitle(`**You need to pass a number**`)
				.setColor('RED')
				.setTimestamp();
			return message.channel.send(messEmbednow);
		}

		console.log(`user wants to delete ${number} message(s)`);

		message.channel
			.bulkDelete(number)
			.then(() => {
				const messEmbednoww = new MessageEmbed()
					.setTitle(`**Deleted ${number} messages!**`)
					.setColor('BLUE')
					.setTimestamp();
				message.channel.send(messEmbednoww).then((msg) => {
					msg.delete({ timeout: 3000 }).catch((error) => {
						console.log(error);
						const messEmbednow = new MessageEmbed()
							.setTitle(`**There was en error while deleting message: ** ***${msg}***`)
							.setColor('BLUE')
							.setTimestamp();
						return message.channel.send(messEmbednow);
					});
				});
			})
			.catch((error) => {
				console.log(error);
				const messEmbednow = new MessageEmbed()
					.setTitle(`**You can only delete messages that are under 14 days old!**`)
					.setColor('BLUE')
					.setTimestamp();
				return message.channel.send(messEmbednow);
			});
		console.log(`deleted ${number} message(s)`);
	},
};

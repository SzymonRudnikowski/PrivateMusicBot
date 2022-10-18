const { MessageEmbed } = require('discord.js');
const fs = require('fs/promises');

module.exports = {
	name: 'send_custom_codes',
	permissions: [],
	async execute(message, args, com, client) {
		if (message.guild.id !== '914969283661037618' || message.author.id !== '391983289122029578') return;
		// if (!message.member.hasPermission(['ADMINISTRATOR'])) {
		// 	const messEmbednow = new MessageEmbed()
		// 		.setTitle(`***${message.author.tag}*** **you don't have permissions to execute this command!**`)
		// 		.setColor('RED')
		// 		.setTimestamp();
		// 	return message.channel.send(messEmbednow);
		// }
		let teamsCodeData;
		await fs.readFile(`./MLE/lol-custom-codes/codes.txt`, 'utf-8').then((data) => {
			teamsCodeData = JSON.parse(data.toString());
		});

		const roleID = '966006170747822131';

		const lolCaptains = await message.guild.roles.cache.get(roleID).members;
		let codeAppear = new Map();

		try {
			lolCaptains.forEach((captain) => {
				//console.log('searching for:', captain.displayName);
				for (let i = 0; i < teamsCodeData.length; i++) {
					const match = teamsCodeData[i];
					// if (match.team1 === captain.displayName) {
					// 	console.log('team1 found:', match.team1);
					// } else if (match.team2 === captain.displayName) {
					// 	console.log('team2 found:', match.team2);
					// }
					if (match.team1 == captain.displayName || match.team2 == captain.displayName) {
						// codeAppear.set(match.code, codeAppear.get(match.code) ? codeAppear.get(match.code) + 1 : 1);
						const messEmbednow = new MessageEmbed()
							.setTitle(`Hi! I am just here to give you your tournament codes.`)
							.setDescription(
								`\nYour opponent have received the same message, enter this code in the *League of Legends* client at the time you and your opponents have agreed on. \n **Code:** ***${match.code}***`
							)
							.setColor('BLUE')
							.setTimestamp();
						captain.send(messEmbednow);
					}
				}
			});
			const messEmbednow = new MessageEmbed().setTitle('Codes sent successfully').setColor('BLUE').setTimestamp();
			message.author.send(messEmbednow);
		} catch (err) {
			console.log(err);
		}
	},
};

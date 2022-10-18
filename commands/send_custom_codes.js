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

		await message.guild.members.fetch();
		const lolCaptains = await message.guild.roles.cache.get(roleID).members;
		const users = await message.guild.roles.cache.get(roleID).members.map((member) => member.user);
		let codeAppear = new Map();

		let codesSent = 0;
		let sendErrors = [];
		console.log(users.length);
		try {
			await lolCaptains.forEach(async (captain) => {
				//console.log('searching for:', captain.nickname);
				for (let i = 0; i < teamsCodeData.length; i++) {
					const match = teamsCodeData[i];
					// if (match.team1 === captain.nickname) {
					// 	console.log('team1 found:', match.team1);
					// } else if (match.team2 === captain.nickname) {
					// 	console.log('team2 found:', match.team2);
					// }
					if (match.team1 == captain.nickname || match.team2 == captain.nickname) {
						// codeAppear.set(match.code, codeAppear.get(match.code) ? codeAppear.get(match.code) + 1 : 1);
						const messEmbednow = new MessageEmbed()
							.setTitle(`Hi! I am just here to give you your tournament codes.`)
							.setDescription(
								`\nYour opponent have received the same message, enter this code in the *League of Legends* client at the time you and your opponents have agreed on. \n **Code:** ***${match.code}***`
							)
							.setColor('BLUE')
							.setTimestamp();
						//console.log('trying to send to:', captain.nickname);

						await captain.user
							.send(messEmbednow)
							.then(() => {
								console.log('code sent to:', captain.nickname);
								codesSent++;
								sleep(100);
							})
							.catch((err) => {
								console.log(captain.nickname, 'has dms blocked');
								sendErrors.push(captain.nickname);
							});
					}
				}
			});

			if (codesSent === users.length) {
				const messEmbednow = new MessageEmbed().setTitle('All codes were sent successfully').setColor('GREEN').setTimestamp();
				await message.author.send(messEmbednow);
			} else {
				let sendErrorsString = '**';
				console.log(sendErrors);
				sendErrors.forEach((error) => {
					sendErrorsString += error + '\n';
				});
				sendErrorsString += '**';
				console.log(sendErrorsString);

				const messEmbednow = new MessageEmbed()
					.setTitle('Not all codes were sent. Captains that errored:')
					.setDescription(sendErrorsString)
					.setColor('RED')
					.setTimestamp();
				await message.author.send(messEmbednow);
			}
		} catch (err) {
			console.log(err);
		}
	},
};

function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}

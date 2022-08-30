const discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs/promises');

module.exports = {
	name: 'match_result_lol',
	async execute(message, args, com, client) {
		if (message.guild.id !== '914969283661037618') return;
		if (!args || !args.length) {
			const messEmbednow = new MessageEmbed().setTitle(`**Invalid syntax! Type !help_mle for further details**`).setColor('RED').setTimestamp();
			return message.channel.send(messEmbednow);
		}
		const input = args.join(' ').split(';'); // team name, score, score, team name
		const team1 = input[0];
		const team2 = input[3];

		console.log(input);
		if (
			input.length !== 4 ||
			isNaN(input[1]) ||
			isNaN(input[2]) ||
			(input[1] !== '0' && input[1] !== '1') ||
			(input[2] !== '0' && input[2] !== '1') ||
			(input[1] === '1' && input[2] === '1')
		) {
			const messEmbednow = new MessageEmbed().setTitle(`**Invalid syntax! Type !help_mle for further details**`).setColor('RED').setTimestamp();
			return message.channel.send(messEmbednow);
		}

		const result = {
			[team1]: input[1],
			[team2]: input[2],
		};

		fs.readFile(`./MLE/match_results_lol.txt`, 'utf-8')
			.then((data) => {
				let matchResults = JSON.parse(data.toString());
				matchResults.forEach((match_result) => {
					if (match_result[team1] && match_result[team2]) {
						throw 0;
					} else if (match_result[team1]) {
						throw 1;
					} else if (match_result[team2]) {
						throw 2;
					}
				});
				matchResults.push(result);

				const return_string = JSON.stringify(matchResults, null, 4);
				fs.writeFile(`./MLE/match_results_lol.txt`, return_string, (err) => {
					if (err) {
						console.log('error while writing the file', err);
					} else {
						console.log('match results csgo have been uploaded');
					}
				}).then(() => {
					const messEmbednow = new MessageEmbed().setTitle(`**Match results have been successfully uploaded**`).setColor('GREEN').setTimestamp();
					return message.channel.send(messEmbednow);
				});
			})
			.catch((errCode) => {
				if (errCode === 0) {
					const messEmbednow = new MessageEmbed()
						.setTitle(`**Match results for** ***${team1}*** **and** ***${team2}*** **have already been uploaded!**`)
						.setColor('RED')
						.setTimestamp();
					return message.channel.send(messEmbednow);
				} else if (errCode === 1) {
					const messEmbednow = new MessageEmbed()
						.setTitle(`**Match results for** ***${team1}*** **have already been uploaded!**`)
						.setColor('RED')
						.setTimestamp();
					return message.channel.send(messEmbednow);
				} else if (errCode === 2) {
					const messEmbednow = new MessageEmbed()
						.setTitle(`**Match results for** ***${team2}*** **have already been uploaded!**`)
						.setColor('RED')
						.setTimestamp();
					return message.channel.send(messEmbednow);
				} else {
					const messEmbednow = new MessageEmbed().setTitle(`**An error occurred while uploading the results!**`).setColor('RED').setTimestamp();
					return message.channel.send(messEmbednow);
				}
			});
	},
};

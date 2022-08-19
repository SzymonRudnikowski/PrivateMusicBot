const discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs/promises');

module.exports = {
	name: 'match_result_csgo',
	async execute(message, args, com, client) {
		if (message.guild.id !== '914969283661037618') return;
		if (!args || !args.length) {
			const messEmbednow = new MessageEmbed().setTitle(`**Invalid syntax! Type !help_mle for further details**`).setColor('RED').setTimestamp();
			return message.channel.send(messEmbednow);
		}
		const input = args.join(' ').split(';'); // team name, score, score, team name

		const result = {
			[input[0]]: input[1],
			[input[3]]: input[2],
		};

		fs.readFile(`./MLE/match_results_csgo.txt`, 'utf-8', (err, data) => {
			if (err) {
				console.log('Error while reading the file');
			} else {
				let matchResults = JSON.parse(data.toString());
				matchResults.push(result);
				const return_string = JSON.stringify(matchResults, null, 4);
				fs.writeFile(`./MLE/match_results_csgo.txt`, return_string, (err) => {
					if (err) {
						console.log('error while writing the file', err);
					} else {
						console.log('match results csgo have been uploaded');
					}
				});
			}
		}).then(() => {
			const messEmbednow = new MessageEmbed().setTitle(`**Match results have been successfully uploaded**`).setColor('GREEN').setTimestamp();
			return message.channel.send(messEmbednow);
		});
	},
};

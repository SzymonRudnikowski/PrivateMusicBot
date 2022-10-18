const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');
const XLSX = require('xlsx');

const KEY = 'f5abf8c7-628c-47d7-a46d-eb4a2788fc26';

const headerFaceit = {
	Authorization: `Bearer ${KEY}`,
};

//dodac hs %

let good = new Map();
let right_players = new Map();
const PATH = './MLE/Zawodnicy_CSGO.xlsx';
let exceedQueue = new Map();

async function getTables(matchID, message, queueNumber) {
	right_players.set(message.guild.id, true);
	const workbook = XLSX.readFile(PATH);
	let res;
	//getting the json response from faceit api
	await fetch('https://open.faceit.com/data/v4/matches/' + matchID + '/stats', {
		method: 'GET',
		headers: headerFaceit,
	})
		.then(function (u) {
			return u.json();
		})
		.then(function (json) {
			res = json;
		});
	console.log(res);

	try {
		let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
		let data = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
		let players_right = new Map(); //keeps track about number of players that differs in each team maximum 1 per team
		res.rounds[0]['teams'].forEach((team) => {
			if (!right_players.get(message.guild.id)) {
				return;
			}
			let team_name = team.team_stats.Team;
			let players = [];
			players_right.set(team_name, 0);

			if (exceedQueue.has(message.guild.id)) {
				exceedQueue.set(message.guild.id, false);
			}

			//getting match stats from faceit api
			let team_name_excel;
			team.players.forEach((player) => {
				let nickname = player.nickname;
				let hs = player.player_stats['Headshots %'];
				let kills = player.player_stats['Kills'];
				let assists = player.player_stats['Assists'];
				let deaths = player.player_stats['Deaths'];
				let kd = player.player_stats['K/D Ratio'];
				//appending stats from faceit api to the excel worksheet

				for (let i = 1; i < data.length; i++) {
					let array = data[i];

					if (array.length) {
						if (array[1].replace(/"/g, '') === nickname) {
							console.log('found: ' + nickname);
							team_name_excel = array[0];
							array[2] += parseInt(kills);
							array[3] += parseInt(assists);
							array[4] += parseInt(deaths);
							let divideBy = parseInt(array[4]) == 0 ? 1 : parseInt(array[4]);
							array[5] = (parseInt(array[2]) / divideBy).toFixed(2); //kd

							array.push(parseInt(kills));
							array.push(parseInt(assists));
							array.push(parseInt(deaths));
							array.push(parseFloat(kd));
							array.push(parseFloat(hs));
							console.log('after insertion:', array);

							let total_hs = 0;
							let rounds = 0;

							for (let i = 11; i < array.length; i += 5) {
								total_hs += array[i];
								rounds++;
							}
							array[6] = (parseFloat(total_hs) / parseFloat(rounds)).toFixed(2);

							players_right.set(team_name, players_right.get(team_name) + 1);
							break;
						}
					}
				}
			});
			console.log('right players for team: ', players_right.get(team_name), team_name);
			if (players_right.get(team_name) < 4) {
				right_players.set(message.guild.id, false);
				return;
			} else {
				players_right.delete(team_name);
			}
			let whole_team = [];
			data.forEach((array) => {
				if (array.length) {
					if (array[0] === team_name_excel) {
						whole_team.push(array);
					}
				}
			});

			let max_length = 0;
			whole_team.forEach((teammate) => {
				if (max_length < teammate.length) {
					max_length = teammate.length;
				}
			});
			console.log('queueNumber: ', queueNumber);
			if ((max_length - 7) / 5 > queueNumber) {
				exceedQueue.set(message.guild.id, true);
				return;
			}
			whole_team.forEach((teammate) => {
				if (teammate.length < max_length) {
					teammate.push(0);
					teammate.push(0);
					teammate.push(0);
					teammate.push(0);
					teammate.push(0);
					console.log(teammate[1], ' got only 0');
				}
			});
			whole_team = [];
			players = [];
		});
		if (!right_players.get(message.guild.id) || exceedQueue.get(message.guild.id)) {
			return;
		}
		let worksheet = XLSX.utils.aoa_to_sheet(data);
		let new_workbook = XLSX.utils.book_new();

		XLSX.utils.book_append_sheet(new_workbook, worksheet, 'Arkusz1');
		XLSX.writeFile(new_workbook, PATH);
	} catch (err) {
		console.log(err);
		console.log('not found');
		good.set(message.guild.id, false);
		return;
	}
	good.set(message.guild.id, true);
	right_players.set(message.guild.id, true);
}

module.exports = {
	name: 'score_csgo',
	aliases: [],
	async execute(message, args, com, client) {
		if (message.guild.id !== '914969283661037618') return;
		let statsEnabled;
		fs.readFile(`./MLE/settings.json`, 'utf-8', (err, data) => {
			if (err) {
				console.log('Error while reading the file');
			} else {
				let settings = JSON.parse(data.toString());
				statsEnabled = settings.statsEnabled;
			}
		});
		setTimeout(() => {
			if (!statsEnabled) {
				const messEmbednow = new MessageEmbed().setTitle(`**Stats recording is currently disabled!**`).setColor('BLUE').setTimestamp();
				return message.channel.send(messEmbednow);
			}

			if (!args.length || !args[0].length) {
				const messEmbednow = new MessageEmbed()
					.setTitle(`***${message.author.tag}*** **you need to enter a link!**`)
					.setColor('BLUE')
					.setTimestamp();
				return message.channel.send(messEmbednow);
			}
			console.log(args[0]);

			if (!args[0].startsWith('https://faceitstats.com/match/') && !args[0].startsWith('https://www.faceit.com/')) {
				console.log('link not valid');
				const messEmbednow = new MessageEmbed()
					.setTitle(`***${message.author.tag}*** **your link is not valid!**`)
					.setColor('RED')
					.setTimestamp();
				return message.channel.send(messEmbednow);
			}
			let link = args[0];
			let exist = false;
			let matchID;

			matchID = link.substring(link.indexOf('1-'), link.indexOf('1-') + 38);

			if (fs.existsSync(`./MLE/urls.txt`)) {
				fs.readFile(`./MLE/urls.txt`, 'utf-8', (err, data) => {
					if (err) {
						console.log('Error while reading the file');
					} else {
						const links = JSON.parse(data.toString());
						links.forEach((matchidTXT) => {
							if (matchidTXT === matchID) {
								exist = true;
								const messEmbednow = new MessageEmbed().setTitle(`**This link has already been uploaded!**`).setColor('RED').setTimestamp();
								message.channel.send(messEmbednow);
							}
						});
					}
				});
			}
			let queueNumber;
			fs.readFile(`./MLE/settings.json`, 'utf-8', (err, data) => {
				if (err) {
					console.log('Error while reading the file');
				} else {
					const settings = JSON.parse(data.toString());
					queueNumber = settings.currentQueue;
				}
			});
			if (!good.has(message.guild.id)) good.set(message.guild.id, true);
			if (!right_players.has(message.guild.id)) right_players.set(message.guild.id, true);

			setTimeout(async () => {
				if (!exist) {
					console.log(matchID);
					await getTables(matchID, message, queueNumber);

					if (exceedQueue.get(message.guild.id)) {
						const messEmbednow = new MessageEmbed()
							.setTitle(`**Your team has already uploaded game stats for current queue!**`)
							.setColor('RED')
							.setTimestamp();
						return message.channel.send(messEmbednow);
					}

					if (!right_players.get(message.guild.id)) {
						const messEmbednow = new MessageEmbed()
							.setTitle(`**The number of players who are not participating in the tournament cannot exceed 1 per team!**`)
							.setDescription(
								`**If someone from your team has changed their nickname during MLE or in the registration process has given a nickname that differs from their original Faceit nickname please inform admins about it - otherwise, you won't be able to upload stats for your game**`
							)
							.setColor('RED')
							.setTimestamp();
						return message.channel.send(messEmbednow);
					}

					if (!good.get(message.guild.id)) {
						const messEmbednow = new MessageEmbed()
							.setTitle(`**Game under this link does not exist! Enter a valid link**`)
							.setColor('RED')
							.setTimestamp();
						return message.channel.send(messEmbednow);
					}

					if (!fs.existsSync(`./MLE/urls.txt`)) {
						fs.writeFile(`./MLE/urls.txt`, '[]', (err) => {
							if (err) {
								console.log('Error writing file', err);
							} else {
								console.log('created file');
							}
						});
					}
					fs.readFile(`./MLE/urls.txt`, 'utf-8', (err, data) => {
						if (err) {
							console.log('Error while reading the file');
						} else {
							const links = JSON.parse(data.toString());
							links.push(matchID);
							const return_string = JSON.stringify(links, null, 4);
							fs.writeFile('./MLE/urls.txt', return_string, (err) => {
								if (err) {
									console.log('error adding the link to the registry');
								} else {
									console.log('link added to the registry');
								}
							});
						}
					});
					const messEmbednow = new MessageEmbed().setTitle(`**The link has been validated successfully!**`).setColor('GREEN').setTimestamp();
					return message.channel.send(messEmbednow);
				}
			}, 1000);
		}, 1000);
	},
};

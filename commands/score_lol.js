const { Queue } = require('discord-player');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');
const XLSX = require('xlsx');

const KEY = 'RGAPI-24aaa1d5-93fc-4a8e-bba0-4290ca207bb9';

let good = new Map();
let right_players = new Map();
const PATH = './MLE/Zawodnicy_LOL.xlsx';
let exceedQueue = new Map();

async function getTables(matchID, message, queueNumber) {
	right_players.set(message.guild.id, true);
	const workbook = XLSX.readFile(PATH);
	let res;
	//getting the json response from faceit api
	await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/EUN1_${matchID}?api_key=${KEY}`)
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
		let team_name_excel_first;
		let team_name_excel_second;
		let whole_teams = [[], []];
		let game_duration = Math.floor(parseInt(res['info'].gameDuration) / 60);

		res['info'].participants.forEach((player) => {
			if (!right_players.get(message.guild.id)) {
				return;
			}

			if (exceedQueue.has(message.guild.id)) {
				exceedQueue.set(message.guild.id, false);
			}

			//getting match stats from lol api

			let nickname = player.summonerName;
			let kills = player.kills;
			let assists = player.assists;
			let deaths = player.deaths;
			let cs = parseInt(player.totalMinionsKilled) + parseInt(player.neutralMinionsKilled);

			//appending stats from lol api to the excel worksheet

			for (let i = 0; i < data.length; i++) {
				let array = data[i];
				if (array.length) {
					if (array[1].replace(/ /g, '') === nickname.replace(/ /g, '')) {
						console.log('found: ' + nickname);

						if (!team_name_excel_first) team_name_excel_first = array[0];
						else if (team_name_excel_first !== array[0] && !team_name_excel_second)
							team_name_excel_second = array[0];

						if (!players_right.has(team_name_excel_first)) {
							players_right.set(team_name_excel_first, 0);
						}
						if (!players_right.has(team_name_excel_second)) {
							players_right.set(team_name_excel_second, 0);
						}

						if (array[0] === team_name_excel_first)
							players_right.set(team_name_excel_first, players_right.get(team_name_excel_first) + 1);
						else players_right.set(team_name_excel_second, players_right.get(team_name_excel_second) + 1);

						array[2] += parseInt(kills);
						array[3] += parseInt(assists);
						array[4] += parseInt(deaths);
						array[6] = ((parseInt(array[2]) + parseInt(array[3])) / parseInt(array[4])).toFixed(2); //KDA
						array.push(parseInt(kills));
						array.push(parseInt(assists));
						array.push(parseInt(deaths));
						array.push(parseFloat(cs / game_duration).toFixed(2));
						let cs_sum = 0;
						let number_of_games = 0;
						for (let i = 16; i < array.length; i += 4) {
							cs_sum += parseFloat(array[i]);
							number_of_games++;
						}
						array[5] = parseFloat(cs_sum / number_of_games).toFixed(2);

						break;
					} else {
						array[6] = parseFloat(array[6]).toFixed(2);
					}
				}
			}
		});

		console.log('right players for team: ', players_right.get(team_name_excel_first), team_name_excel_first);
		console.log('right players for team: ', players_right.get(team_name_excel_second), team_name_excel_second);

		if (players_right.get(team_name_excel_first) < 4 || players_right.get(team_name_excel_second) < 4) {
			right_players.set(message.guild.id, false);
			return;
		} else {
			players_right.delete(team_name_excel_first);
			players_right.delete(team_name_excel_second);
		}

		data.forEach((array) => {
			if (array.length) {
				if (array[0] === team_name_excel_first) {
					whole_teams[0].push(array);
				} else if (array[0] === team_name_excel_second) {
					whole_teams[1].push(array);
				}
			}
		});

		let max_length = 0;
		whole_teams.forEach((whole_team) => {
			whole_team.forEach((teammate) => {
				console.log(teammate);
				if (max_length < teammate.length) {
					max_length = teammate.length;
				}
			});
		});
		console.log('queueNumber: ', queueNumber);
		console.log('max length: ', max_length);
		if ((max_length - 13) / 4 > queueNumber - 2) {
			exceedQueue.set(message.guild.id, true);
			return;
		}
		whole_teams.forEach((whole_team) => {
			whole_team.forEach((teammate) => {
				if (teammate.length < max_length) {
					teammate.push(0);
					teammate.push(0);
					teammate.push(0);
					teammate.push(parseFloat(5.0).toFixed(2));
					console.log(teammate[1], ' got only 0');
				}
			});
		}); //adding data for players who have not played in the game

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
	name: 'score_lol',
	aliases: [],
	async execute(message, args, com, client) {
		if (message.guild.id !== '914969283661037618') return;
		let statsEnabled;
		fs.readFile(`./MLE/settings.json`, 'utf-8', (err, data) => {
			if (err) {
				console.log(err);
				console.log('Error while reading the file');
			} else {
				let settings = JSON.parse(data.toString());
				statsEnabled = settings.statsEnabledLOL;
			}
		});
		setTimeout(() => {
			if (!statsEnabled) {
				const messEmbednow = new MessageEmbed()
					.setTitle(`**Stats recording is currently disabled!**`)
					.setColor('BLUE')
					.setTimestamp();
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

			if (!args[0].startsWith('https://www.leagueofgraphs.com/')) {
				console.log('link not valid');
				const messEmbednow = new MessageEmbed()
					.setTitle(`***${message.author.tag}*** **your link is not valid!**`)
					.setColor('RED')
					.setTimestamp()
					.setDescription('(Only links from https://www.leagueofgraphs.com are accepted!)');
				return message.channel.send(messEmbednow);
			}
			let link = args[0];
			let exist = false;
			let matchID;

			matchID = link.substring(link.indexOf('30'), link.indexOf('30') + 10);

			if (fs.existsSync(`./MLE/urls.txt`)) {
				fs.readFile(`./MLE/urls.txt`, 'utf-8', (err, data) => {
					if (err) {
						console.log('Error while reading the file');
					} else {
						const links = JSON.parse(data.toString());
						links.forEach((matchidTXT) => {
							if (matchidTXT === matchID) {
								exist = true;
								const messEmbednow = new MessageEmbed()
									.setTitle(`**This link has already been uploaded!**`)
									.setColor('RED')
									.setTimestamp();
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
					queueNumber = settings.currentQueueLOL;
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
							.setTitle(
								`**The number of players who are not participating in the tournament cannot exceed 1 per team!**`
							)
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
							console.log(return_string);
							fs.writeFile('./MLE/urls.txt', return_string, (err) => {
								if (err) {
									console.log('error adding the link to the registry');
								} else {
									console.log('link added to the registry');
								}
							});
						}
					});
					const messEmbednow = new MessageEmbed()
						.setTitle(`**The link has been validated successfully!**`)
						.setColor('GREEN')
						.setTimestamp();
					return message.channel.send(messEmbednow);
				}
			}, 1000);
		}, 1000);
	},
};

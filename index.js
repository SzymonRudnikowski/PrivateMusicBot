const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const XLSX = require('xlsx');
const { MessageEmbed, Intents } = require('discord.js');

const intents = new Intents([
	Intents.NON_PRIVILEGED, // include all non-privileged intents, would be better to specify which ones you actually need
	'GUILD_MEMBERS', // lets you request guild members (i.e. fixes the issue with send_custom_codes.js)
]);
const client = new Discord.Client({ ws: { intents } });
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
client.aliases = new Discord.Collection();

let commandUsedRecently = new Map();
let mutedUsers = new Map();
let mutedUsersCurrently = new Set();
global.hasJoinedChannel = new Map();

const PATH_LOL = './MLE/Zawodnicy_LOL.xlsx';
const PATH_CSGO = './MLE/Zawodnicy_CSGO.xlsx';
const PATH_DISPLAY_CSGO = './MLE/DisplaySheetCSGO.xlsx';
const PATH_DISPLAY_LOL = './MLE/DisplaySheetLOL.xlsx';

let intervals = [30000, 60000, 300000, 1800000, 3600000, 10800000, 43200000, 86400000]; //for spamming timeouts
//                30s    60s    5min    30min    1hour    3hours    12hours   24hours
//const BOT_ID = "892442837252206633";

global.prefix = config.prefix;
global.BOT_ID = config.id;

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);

	if (command.aliases) {
		command.aliases.forEach((alias) => {
			client.aliases.set(alias, command);
		});
	}
}

client.on('voiceStateUpdate', (oldState, newState) => {
	if (!hasJoinedChannel.has(oldState.guild.id)) return;

	if ((oldState.channelID != null && newState.channelID != null && newState.channelID != oldState.channelID) || newState.channelID === null) {
		console.log('someone left or switched channels');
		if (oldState.member.id === client.user.id) {
			console.log('this was me who got disconnected');
			hasJoinedChannel.delete(oldState.guild.id);
			return;
		} //if someone decides to disconnect the bot manually via discord we gotta remove this guild from map hasJoinedChannel
		//later when we gonna call .get(guild.id) its going to return undefined (false) so the user will be
		//able to play something again and so the error was fixed :DDDD
		if (oldState.channel.members.size - 1 === 0) {
			console.log('no users in a channel, leaving in 5 secs');
			setTimeout(() => {
				if (oldState.channel.members.size - 1 === 0) {
					console.log('No users in the channel, leaving it');
					if (songTitles.has(oldState.guild.id)) songTitles.delete(oldState.guild.id);
					if (YoutubeTitle.has(oldState.guild.id)) YoutubeTitle.delete(oldState.guild.id);
					if (looped.has(oldState.guild.id)) looped.delete(oldState.guild.id);
					if (queue.has(oldState.guild.id)) queue.delete(oldState.guild.id);
					if (hasJoinedChannel.has(oldState.guild.id)) hasJoinedChannel.delete(oldState.guild.id);
					return oldState.channel.leave();
				} else {
					console.log('still someone in the channel');
				}
			}, 5000);
		}
	}
});

function endQueueZeroAdd_CSGO(statsEnabled, queueNumber) {
	if (!statsEnabled) {
		console.log('its monday but stats in cs are off');
		return;
	}
	const workbook = XLSX.readFile(PATH_CSGO);
	let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
	let data = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });

	for (let i = 0; i < data.length; i++) {
		let array = data[i];
		console.log(array.length, queueNumber * 5 + 7);
		if (array.length) {
			if (array.length === (queueNumber - 1) * 5 + 7) {
				array[2] += parseInt(0);
				array[3] += parseInt(0);
				array[4] += parseInt(0);

				let divideBy = !parseInt(array[4]) ? 1 : parseInt(array[4]);
				array[5] = (parseInt(array[2]) / divideBy).toFixed(2); //kd

				array.push(0);
				array.push(0);
				array.push(0);
				array.push(0);
				array.push(0);

				let total_kd = 0;
				let rounds = 0;

				for (let i = 11; i < array.length; i += 5) {
					total_kd += array[i];
					rounds++;
				}
				array[6] = (parseFloat(total_kd) / parseFloat(rounds)).toFixed(2);
			}
		}
	}
	let worksheet = XLSX.utils.aoa_to_sheet(data);
	let new_workbook = XLSX.utils.book_new();

	XLSX.utils.book_append_sheet(new_workbook, worksheet, 'Arkusz1');
	XLSX.writeFile(new_workbook, PATH_CSGO);
}

function endQueueZeroAdd_LOL(statsEnabled, queueNumber) {
	if (!statsEnabled) {
		console.log('its monday but stats in lol are off');
		return;
	}
	const workbook = XLSX.readFile(PATH_LOL);
	let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
	let data = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });

	for (let i = 0; i < data.length; i++) {
		let array = data[i];
		if (array.length) {
			if (array.length === 8 + (queueNumber - 1) * 6) {
				array[2] += parseInt(0);
				array[3] += parseInt(0);
				array[4] += parseInt(0);
				let divideBy = !parseFloat(array[4]) ? 1 : parseFloat(array[4]);
				array[5] = parseFloat((parseFloat(array[2]) + parseFloat(array[3])) / divideBy).toFixed(2); //KDA
				array.push(0);
				array.push(0);
				array.push(0);
				array.push(0);
				array.push(0);
				array.push(0).toFixed(2);

				let cs_sum = 0;
				let kp_sum = 0;
				let number_of_games = 0;
				for (let i = 12; i < array.length; i += 6) {
					cs_sum += parseFloat(array[i]);
					kp_sum += parseFloat(array[i + 1]);
					number_of_games++;
				}

				array[6] = parseFloat(cs_sum / number_of_games).toFixed(2);
				array[7] = parseFloat(kp_sum / number_of_games).toFixed(2);
			}
		}
	}
	let worksheet = XLSX.utils.aoa_to_sheet(data);
	let new_workbook = XLSX.utils.book_new();

	XLSX.utils.book_append_sheet(new_workbook, worksheet, 'Arkusz1');
	XLSX.writeFile(new_workbook, PATH_LOL);
}

function createDisplaySheetCSGO(statsEnabled, queueNumber) {
	if (!statsEnabled) {
		console.log('its monday but stats in csgo display sheet are off');
		return;
	}
	const workbook = XLSX.readFile(PATH_CSGO);
	let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
	let data = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });

	let displayData = [
		[
			'Position',
			'Player',
			'Team',
			'Score',
			'Total Kills',
			'Total Assists',
			'Total Deaths',
			'Total KD',
			'Total HS%',
			`${queueNumber}. Kills`,
			`${queueNumber}. Assists`,
			`${queueNumber}. Deaths`,
			`${queueNumber}. KD`,
			`${queueNumber}. HS%`,
		],
	];
	for (let i = 1; i < data.length; i++) {
		const array = data[i];
		if (array.length) {
			let playerData = [-1]; //since position is gonna get changed after sorting everything
			for (let j = 0; j < 7; j++) {
				playerData.push(array[j]); //total stats
			}
			const temp = playerData[1]; //team name
			playerData[1] = playerData[2]; //swapping team name with player name
			playerData[2] = temp;

			const score = (playerData[3] + playerData[4] / 2) * playerData[6]; // these indexes are proper as we havent yet added score to the array
			playerData.splice(3, 0, score); //score (total kills + total assists/2) * total kd

			for (let j = 7 + (queueNumber - 1) * 5; j < 7 + (queueNumber - 1) * 5 + 5; j++) {
				playerData.push(array[j]); //stats for this particular queue
			}
			displayData.push(playerData);
		}
	}

	displayData.sort((a, b) => {
		return b[3] - a[3]; //descending order
	});

	for (let i = 1; i < displayData.length; i++) {
		displayData[i][0] = i; //position number
	}

	let worksheet = XLSX.utils.aoa_to_sheet(displayData);
	let new_workbook = XLSX.utils.book_new();

	XLSX.utils.book_append_sheet(new_workbook, worksheet, 'Arkusz1');
	XLSX.writeFile(new_workbook, PATH_DISPLAY_CSGO);
}

function createDisplaySheetLOL(statsEnabled, queueNumber) {
	if (!statsEnabled) {
		console.log('its monday but stats in lol display sheet are off');
		return;
	}
	const workbook = XLSX.readFile(PATH_LOL);
	let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
	let data = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });

	let displayData = [
		[
			'Position',
			'Player',
			'Team',
			'Score',
			'Total Kills',
			'Total Assists',
			'Total Deaths',
			'Total KDA',
			'Total CS/min',
			'Total KP',
			`${queueNumber}. Kills`,
			`${queueNumber}. Assists`,
			`${queueNumber}. Deaths`,
			`${queueNumber}. KDA`,
			`${queueNumber}. CS/min`,
			`${queueNumber}. KP`,
		],
	];
	for (let i = 1; i < data.length; i++) {
		const array = data[i];
		if (array.length) {
			let playerData = [-1]; //since position is gonna get changed after sorting everything
			for (let j = 0; j < 8; j++) {
				playerData.push(array[j]); //total stats
			}
			const temp = playerData[1]; //team name
			playerData[1] = playerData[2]; //swapping team name with player name
			playerData[2] = temp;

			const score = ((playerData[3] + playerData[4]) / 2) * playerData[6];
			playerData.splice(3, 0, score); //score (total kills + total assists)/2 * total kda

			for (let j = 8 + (queueNumber - 1) * 6; j < 8 + (queueNumber - 1) * 6 + 6; j++) {
				playerData.push(array[j]); //stats for this particular queue
			}
			displayData.push(playerData);
		}
	}

	displayData.sort((a, b) => {
		return b[3] - a[3]; //descending order
	});

	for (let i = 1; i < displayData.length; i++) {
		displayData[i][0] = i; //position number
	}

	let worksheet = XLSX.utils.aoa_to_sheet(displayData);
	let new_workbook = XLSX.utils.book_new();

	XLSX.utils.book_append_sheet(new_workbook, worksheet, 'Arkusz1');
	XLSX.writeFile(new_workbook, PATH_DISPLAY_LOL);
}

client.setInterval(() => {
	mutedUsers.clear();
	console.log('muted registry cleared | map size: ' + mutedUsers.size);
}, 86400000); //clear mute stage every day 86400000

// client.setInterval(() => {
// 	let date = new Date();
// 	let day = date.getDay();
// 	let hour = date.getHours(); //kiedy stats sa off to nie zmienia
// 	let queueNumberCSGO;
// 	let queueNumberLOL;
// 	let statsEnabledFileCSGO = true;
// 	let statsEnabledFileLOL = true;
// 	if (day === 1 && hour === 21) {
// 		fs.readFile(`./MLE/settings.json`, 'utf-8', (err, data) => {
// 			if (err) {
// 				console.log('Error while reading the file', err);
// 			} else {
// 				let settings = JSON.parse(data.toString());
// 				statsEnabledFileCSGO = settings.statsEnabled;
// 				statsEnabledFileLOL = settings.statsEnabledLOL;

// 				if (settings.statsEnabled || settings.statsEnabledLOL) {
// 					if (settings.statsEnabled) {
// 						settings.currentQueue++;
// 						console.log('cs queue number incremented');
// 					}
// 					if (settings.statsEnabledLOL) {
// 						settings.currentQueueLOL++;
// 						console.log('lol queue number incremented');
// 					}

// 					const return_string = JSON.stringify(settings, null, 4);
// 					fs.writeFile(`./MLE/settings.json`, return_string, (err) => {
// 						if (err) {
// 							console.log('error while writing the file', err);
// 						} else {
// 							console.log('queue number got changed cause its monday');
// 						}
// 					});
// 				} else {
// 					console.log('not changed actually cause cs is off');
// 				}

// 				queueNumberCSGO = settings.currentQueue;
// 				queueNumberLOL = settings.currentQueueLOL;
// 			}
// 		});

// 		setTimeout(() => {
// 			console.log('updating all stats cause its monday, queue csgo:', queueNumberCSGO - 1, ' | queue lol: ', queueNumberLOL - 1);
// 			endQueueZeroAdd_CSGO(statsEnabledFileCSGO, queueNumberCSGO - 1);
// 			endQueueZeroAdd_LOL(statsEnabledFileLOL, queueNumberLOL - 1);
// 			createDisplaySheetCSGO(statsEnabledFileCSGO, queueNumberCSGO - 1);
// 			createDisplaySheetLOL(statsEnabledFileLOL, queueNumberLOL - 1);
// 		}, 1000);
// 	}
// }, 3600000); // check every hour if new queue should be turned on

client.on('message', (message) => {
	if (!message.content.startsWith(prefix) || mutedUsersCurrently.has(message.author.id)) return;

	if (!commandUsedRecently.has(message.author.id)) commandUsedRecently.set(message.author.id, 1);

	if (commandUsedRecently.get(message.author.id) === 3) {
		console.log(mutedUsers.has(message.author.id));
		if (mutedUsers.has(message.author.id)) mutedUsers.set(message.author.id, mutedUsers.get(message.author.id) + 1);
		else mutedUsers.set(message.author.id, 0);
		console.log(mutedUsers.has(message.author.id));
		const messEmbednow = new MessageEmbed().setColor('BLUE').setTimestamp();

		if (intervals[mutedUsers.get(message.author.id)] / 1000 <= 60)
			messEmbednow.setTitle(`**You are sending messages too fast! Try again in ${intervals[mutedUsers.get(message.author.id)] / 1000} seconds**`);
		else if (intervals[mutedUsers.get(message.author.id)] / 1000 > 60 && intervals[mutedUsers.get(message.author.id)] / 1000 <= 1800)
			messEmbednow.setTitle(
				`**You are sending messages too fast! Try again in ${intervals[mutedUsers.get(message.author.id)] / 1000 / 60} minutes**`
			);
		else if (intervals[mutedUsers.get(message.author.id)] / 1000 === 3600)
			messEmbednow.setTitle(
				`**You are sending messages too fast! Try again in ${intervals[mutedUsers.get(message.author.id)] / 1000 / 60 / 60} hour**`
			);
		else if (intervals[mutedUsers.get(message.author.id)] / 1000 > 1800)
			messEmbednow.setTitle(
				`**You are sending messages too fast! Try again in ${intervals[mutedUsers.get(message.author.id)] / 1000 / 60 / 60} hours**`
			);

		message.channel.send(messEmbednow);
		mutedUsersCurrently.add(message.author.id);

		setTimeout(() => {
			// Removes the user from the set after proper amount of time
			commandUsedRecently.set(message.author.id, 0);
			mutedUsersCurrently.delete(message.author.id);
		}, intervals[mutedUsers.get(message.author.id)]);

		console.log(`[${message.author.tag}] in [${message.guild.name}] is spamming, blocked`);
		return;
	} else {
		/*if(!fs.existsSync(`./jsons/${message.member.guild.id}.json`)) {
          message.channel.send('**This server is not authorized!**')
          return; 
        } 
        */
		let userID = message.author.id;
		if (userID == BOT_ID) return;

		commandUsedRecently.set(message.author.id, commandUsedRecently.get(message.author.id) + 1);
		const version = 'Version 0.2';
		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		const com = client.commands.get(command) || client.aliases.get(command);

		if (!client.aliases.has(command) && !client.commands.has(command)) {
			const embed = new Discord.MessageEmbed()
				.setColor('0x03f4fc')
				.setTitle('Command does not exist!')
				.setDescription(`**There is no command \"${command}\"\n For help type !help**`)
				.setFooter('PMB');

			///return message.channel.send(embed);
			return console.log('Incorrect command.');
		}

		/*
        if((message.author.id != '391983289122029578' && message.author.id != '259046058737270784') && !fs.existsSync(`./jsons/${message.member.guild.id}.json`)) {
          message.channel.send('**This server is not authorized!**')
          return; 
        } 
        */

		client.setTimeout(function () {
			setTimeout(function () {
				commandUsedRecently.set(message.author.id, 0);
			}, 2000);
		});

		try {
			com.execute(message, args, com, client);
		} catch (error) {
			console.error(error);
			const messEmbednow = new MessageEmbed().setTitle(`**There was an issue executing this command!**`).setColor('BLUE').setTimestamp();
			message.channel.send(messEmbednow);
		}
	}
});

client.login(config.token);

//client.login("ODkyNDQyODM3MjUyMjA2NjMz.YVM-KQ.D1qaqUjLmd_KWQsCVFPjPDOk7c8");

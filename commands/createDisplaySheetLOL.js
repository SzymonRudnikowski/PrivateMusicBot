const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

const PATH_LOL = './MLE/Zawodnicy_LOL.xlsx';
const PATH_CSGO = './MLE/Zawodnicy_CSGO.xlsx';
const PATH_DISPLAY_CSGO = './MLE/DisplaySheetCSGO.xlsx';
const PATH_DISPLAY_LOL = './MLE/DisplaySheetLOL.xlsx';

module.exports = {
	name: 'create-display-sheet-lol',
	description: 'stops stats recording',
	permissions: [],
	async execute(message, args, com, client) {
		createDisplaySheetLOL(true, 1);
	},
};

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

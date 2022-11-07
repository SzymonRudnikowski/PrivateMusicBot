const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const XLSX = require('xlsx');

const PATH_LOL = './MLE/Zawodnicy_LOL.xlsx';

module.exports = {
	name: 'fill-zeros-lol',
	description: '',
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
		endQueueZeroAdd_LOL(true, 3);
	},
};

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

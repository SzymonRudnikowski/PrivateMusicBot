const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const XLSX = require('xlsx');
const fs = require('fs');

const PATH = './MLE/TeamsRegistered.xlsx';

module.exports = {
	name: 'clear_id',
	description: 'deletes user data from excel table',
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

		if (!args.length || !args[0].length) {
			const messEmbednow = new MessageEmbed().setTitle(`***${message.author.tag}*** **you need to enter an id!**`).setColor('BLUE').setTimestamp();
			return message.channel.send(messEmbednow);
		}
		const id = args[0];
		if (
			id.length !== 6 ||
			id.match(/[^a-zA-Z0-9]+/g) ||
			(!id.startsWith('CS') && !id.startsWith('LO') && !id.startsWith('VA')) ||
			(id[2] !== 'K' && id[2] !== 'Z')
		) {
			const messEmbednow = new MessageEmbed().setTitle(`**That is not a valid id!**`).setColor('RED').setTimestamp();
			return message.channel.send(messEmbednow);
		}

		let idFree = true;

		fs.readFile(`./MLE/already_registered.txt`, 'utf-8', (err, data) => {
			if (err) {
				console.log('Error while reading the file');
			} else {
				let ids = JSON.parse(data.toString());
				for (let i = 0; i < ids.length; i++) {
					if (ids[i] === id) {
						idFree = false;
						break;
					}
				}
			}
		});

		let mainRole;
		let categoryRole;

		if (id.startsWith('CS')) {
			//csgo
			categoryRole = 'CS:GO';
			if (id[2] === 'K') {
				//kapitan
				mainRole = message.guild.roles.cache.find((role) => role.name === 'CS:GO - Kapitan');
			} else {
				//zawodnik
				mainRole = message.guild.roles.cache.find((role) => role.name === 'CS:GO - Zawodnik');
			}
		} else if (id.startsWith('LO')) {
			//lol
			categoryRole = 'League of Legends';

			if (id[2] === 'K') {
				//kapitan
				mainRole = message.guild.roles.cache.find((role) => role.name === 'LOL - Kapitan');
			} else {
				//zawodnik
				mainRole = message.guild.roles.cache.find((role) => role.name === 'LOL - Zawodnik');
			}
		} else {
			categoryRole = 'Valorant';

			if (id[2] === 'K') {
				//kapitan
				mainRole = message.guild.roles.cache.find((role) => role.name === 'VAL - Kapitan');
			} else {
				//zawodnik
				mainRole = message.guild.roles.cache.find((role) => role.name === 'VAL - Zawodnik');
			}
		} //valorant

		const workbook = XLSX.readFile(PATH);

		let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
		let data = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });

		let idFound = false;

		let userID;

		for (let i = 0; i < data.length; i++) {
			let array = data[i];
			if (array.length) {
				if (id === array[1]) {
					idFound = true;
					userID = array[3];
				}
			}
		}
		if (!idFound) {
			const messEmbednow = new MessageEmbed().setTitle(`**This id does not exist**`).setColor('RED').setTimestamp();
			return message.channel.send(messEmbednow);
		}

		setTimeout(() => {
			if (idFree) {
				const messEmbednow = new MessageEmbed()
					.setTitle(`**This user has not yet registered for this category! Category: (${categoryRole})**`)
					.setColor('RED')
					.setTimestamp();
				return message.channel.send(messEmbednow);
			}
			fs.readFile(`./MLE/already_registered.txt`, 'utf-8', (err, data) => {
				if (err) {
					console.log(err);
					console.log('Error while reading the file');
				} else {
					const ids = JSON.parse(data.toString());
					ids.splice(ids.indexOf(id), 1);
					const return_string = JSON.stringify(ids, null, 4);
					fs.writeFile('./MLE/already_registered.txt', return_string, (err) => {
						if (err) {
							console.log('error removing id from the registry');
						} else {
							console.log('id removed from the registry');
						}
					});
				}
			});

			setTimeout(() => {
				console.log(userID);
				const member = message.guild.members.cache.get(userID);
				const usersNickname = member.displayName;
				const guestRole = message.guild.roles.cache.find((role) => role.name === 'Go\u015B\u0107');

				member.roles.remove(mainRole).catch((err) => {
					console.log(err);
					const messEmbednow = new MessageEmbed().setTitle(`**Failed to remove category role**`).setColor('RED').setTimestamp();
					return message.channel.send(messEmbednow);
				});

				member.roles.add(guestRole).catch((err) => {
					console.log(err);
					const messEmbednow = new MessageEmbed().setTitle(`**Failed to add guest role**`).setColor('RED').setTimestamp();
					return message.channel.send(messEmbednow);
				});

				member.setNickname('').catch((err) => {
					console.log(err);
					const messEmbednow = new MessageEmbed().setTitle(`**Failed to reset the nickname**`).setColor('RED').setTimestamp();
					return message.channel.send(messEmbednow);
				});

				for (let i = 0; i < data.length; i++) {
					let array = data[i];
					if (array.length) {
						if (array[1].toString() === id.toString()) {
							array.splice(2, 3);
						}
					}
				}

				let worksheet = XLSX.utils.aoa_to_sheet(data);
				let new_workbook = XLSX.utils.book_new();

				XLSX.utils.book_append_sheet(new_workbook, worksheet, 'Arkusz1');
				XLSX.writeFile(new_workbook, PATH);

				const messEmbednow = new MessageEmbed()
					.setTitle(`**User successfully deleted! Category: ${categoryRole}**`)
					.setColor('GREEN')
					.setTimestamp();
				return message.channel.send(messEmbednow);
			}, 1000);
		}, 100);
	},
};

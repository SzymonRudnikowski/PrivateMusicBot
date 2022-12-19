const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'kick',
	description: 'it does what u think it does',
	permissions: [],
	async execute(message, args) {
		//return; // command inactive - bot is currently being used for other purposes
		if (!args.length) {
			const messEmbednow = new MessageEmbed()
				.setTitle(`${message.author} ***you have to specify the user you want to kick!***`)
				.setColor('BLUE')
				.setTimestamp();
			return message.channel.send(messEmbednow);
		}
		let person = message.guild.member(message.mentions.members.first());
		if (message.member.hasPermission(['KICK_MEMBERS', 'ADMINISTRATOR'])) {
			let member = message.mentions.members.first();

			if (!member) {
				const messEmbednow = new MessageEmbed().setTitle(`**Please mention a valid member of this server**`).setColor('BLUE').setTimestamp();
				return message.channel.send(messEmbednow);
			}
			if (!member.kickable) {
				const messEmbednow = new MessageEmbed()
					.setTitle(`**I do not have the right permissions to kick** ***${person.user.tag}***`)
					.setColor('BLUE')
					.setTimestamp();
				return message.channel.send(messEmbednow);
			}

			member.kick();
			const messEmbednow = new MessageEmbed().setTitle(`***${person.user.tag} kicked!***`).setColor('BLUE').setTimestamp();
			return message.channel.send(messEmbednow);
		} else {
			const messEmbednow = new MessageEmbed()
				.setTitle(`**${message.author.tag} you do not have permissions to kick** ***${person.user.tag}***`)
				.setColor('BLUE')
				.setTimestamp();
			return message.channel.send(messEmbednow);
		}
	},
};

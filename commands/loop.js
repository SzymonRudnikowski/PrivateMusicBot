const discord = require('discord.js');
const songTit = require('./play');
const { MessageEmbed } = require('discord.js');

global.looped = new Map();

module.exports = {
	name: 'loop',
	aliases: ['lp'],
	description: 'loop current song',
	async execute(message, args, com, client) {
		//return; // command inactive - bot is currently being used for other purposes
		if (!looped.has(message.guild.id)) looped.set(message.guild.id, false);
		if (!message.member.voice.channel) {
			const messEmbednow = new MessageEmbed()
				.setTitle(`***${message.author}*** **You need to be in a voice channel to execute this command!**`)
				.setColor('BLUE')
				.setTimestamp();
			return message.channel.send(messEmbednow);
		}
		const inSameChannel = client.voice.connections.some((connection) => connection.channel.id === message.member.voice.channelID);

		if (!inSameChannel) {
			const messEmbednow = new MessageEmbed()
				.setTitle(`***${message.author}*** **you need to be in the same channel as the bot!**`)
				.setColor('BLUE')
				.setTimestamp();
			return message.channel.send(messEmbednow);
		}
		try {
			if (!YoutubeTitle.has(message.guild.id) || YoutubeTitle.get(message.guild.id).length === 1) throw err;
		} catch (err) {
			console.log('loop while no music played');
			if (!YoutubeTitle.has(message.guild.id) || YoutubeTitle.get(message.guild.id).length === 1) {
				const messEmbednow = new MessageEmbed().setTitle(`**No music is currently played!**`).setColor('BLUE').setTimestamp();
				return message.channel.send(messEmbednow);
			}
		}

		if (looped.get(message.guild.id)) {
			const messEmbednow = new MessageEmbed()
				.setTitle(`***${YoutubeTitle.get(message.guild.id)[1]}*** **is already in loop!**`)
				.setColor('RED')
				.setTimestamp();
			return message.channel.send(messEmbednow);
		}
		looped.set(message.guild.id, true);
		console.log('looped! status: ' + looped.get(message.guild.id));
		const messEmbednow = new MessageEmbed()
			.setTitle(`***${YoutubeTitle.get(message.guild.id)[1]}*** **looped!**`)
			.setColor('BLUE')
			.setTimestamp();
		return message.channel.send(messEmbednow);
	},
};

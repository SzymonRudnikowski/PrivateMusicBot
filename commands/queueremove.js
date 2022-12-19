const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'queueremove',
	aliases: ['queue_remove', 'qr'],
	decription: 'removes a specific song from queue',
	async execute(message, args) {
		//return; // command inactive - bot is currently being used for other purposes
		if (!message.member.voice.channel) {
			const messEmbednow = new MessageEmbed()
				.setTitle(`***${message.author.tag}*** **you need to be in a voice channel to execute this command!**`)
				.setColor('BLUE')
				.setTimestamp();
			return message.channel.send(messEmbednow);
		}
		if (!args.length) {
			const messEmbednow = new MessageEmbed()
				.setTitle(`${message.author.tag} ** You need to specify position in queue to remove! ** `)
				.setColor('BLUE')
				.setTimestamp();
			return message.channel.send(messEmbednow);
		}

		try {
			if (parseInt(args[0]) > server_queue.songs.length - 1 || parseInt(args[0]) < 1)
				return message.channel.send('**There is no such a position!**');
			let removedTitle = server_queue.songs[args[0]].title;
			server_queue.songs.splice(args[0], 1);
			console.log('removed an item from queue');
			return message.channel.send('***' + removedTitle + '*** **has been successfully removed from the queue!**');
		} catch (err) {
			console.log('tried to remove song from empty queue');
			return message.channel.send('**Queue is empty!**');
		}
	},
};

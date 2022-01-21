const Discord = require("discord.js");

module.exports = {
    name: 'ban',
    description: 'it does what u think it does',
    permissions: [],
    async execute(message, args, com, client) {
        if (!args.length) {
            const messEmbednow = new MessageEmbed()
                .setTitle(`***${message.author}*** **you have to specify the user you want to ban!**`).setColor('BLUE').setTimestamp();
            return message.channel.send(messEmbednow);
        }
        const guild = client.guild.cache.get(message.guild.id);
        if (!guild.me.hasPermission("ADMINISTRATOR")) {
            const messEmbednow = new MessageEmbed()
                .setTitle(`**I do not have permissions to ban** ***${message.mentions.members.first()}***`).setColor('BLUE').setTimestamp();
            return message.channel.send(messEmbednow);
        }

        let userId = args[0].toString().replace(/</g, '')
        userId = userId.replace(/!/g, '')
        userId = userId.replace(/>/g, '')
        userId = userId.replace(/@/g, '')

        try {
            const banList = await message.guild.fetchBans();
            const targetId = banList.get(userId).user

            if (targetId) {
                console.log(`${args[0]} is already banned!`)
                const messEmbednow = new MessageEmbed()
                    .setTitle(`***${args[0]}*** ** is already banned!**`).setColor('BLUE').setTimestamp();
                return message.channel.send(messEmbednow);
            }
        } catch (err) {
            console.log(err);
            if (!message.guild.member(userId)) {
                const messEmbednow = new MessageEmbed()
                    .setTitle(`**There is no user named** ***${args[0]}***`).setColor('BLUE').setTimestamp();
                return message.channel.send(messEmbednow);
            }
        }

        if (message.member.hasPermission(['KICK_MEMBERS', 'ADMINISTRATOR']) || message.author.id === '259046058737270784' || message.author.id === '391983289122029578') {
            if (message.mentions.members.first()) {
                try {
                    message.mentions.members.first().ban();
                    console.log(`${message.mentions.members.first()} banned!`)
                    const messEmbednow = new MessageEmbed()
                        .setTitle(`${message.mentions.members.first()} **has been successfuly banned from this server!**`).setColor('BLUE').setTimestamp();
                    return message.channel.send(messEmbednow);
                } catch {
                    return message.reply(`***I do not have permissions to ban ${message.mentions.members.first()}***`);
                }
            }
        }
        else {
            return message.reply(`***You do not have permissions to ban ${message.mentions.members.first()}***`);
        }
    },
};
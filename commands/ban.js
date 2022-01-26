const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'ban',
    description: 'it does what u think it does',
    permissions: [],
    async execute(message, args, com, client) {
        if (!args || !args[0].length) {
            const messEmbednow = new MessageEmbed()
                .setTitle(`***${message.author}*** **you have to specify the user you want to ban!**`).setColor('BLUE').setTimestamp();
            return message.channel.send(messEmbednow);
        }
        let person = message.guild.member(message.mentions.members.first());
        if (!person) {
            const messEmbednow = new MessageEmbed()
                .setTitle(`**Please mention a valid member of this server**`).setColor('BLUE').setTimestamp();
            return message.channel.send(messEmbednow);
        }
        if (!person.bannable) {
            const messEmbednow = new MessageEmbed()
                .setTitle(`**I do not have permissions to ban** ***${person.user.tag}***`).setColor('BLUE').setTimestamp();
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
                console.log(`${person.user.tag} is already banned!`)
                const messEmbednow = new MessageEmbed()
                    .setTitle(`***${person.user.tag}*** ** is already banned!**`).setColor('BLUE').setTimestamp();
                return message.channel.send(messEmbednow);
            }
        } catch (err) {
            console.log(`${person.user.tag} not banned yet`);
            if (!message.guild.member(userId)) {
                const messEmbednow = new MessageEmbed()
                    .setTitle(`**There is no user named** ***${person.user.tag}***`).setColor('BLUE').setTimestamp();
                return message.channel.send(messEmbednow);
            }
        }

        if (message.member.hasPermission(['ADMINISTRATOR'])) {
            if (message.mentions.members.first()) {
                message.mentions.members.first().ban();
                console.log(`${person.user.tag} banned!`)
                const messEmbednow = new MessageEmbed()
                    .setTitle(`***${person.user.tag}*** **has been successfuly banned from this server!**`).setColor('BLUE').setTimestamp();
                return message.channel.send(messEmbednow);
            }
        } else {
            const messEmbednow = new MessageEmbed()
                .setTitle(`***${person.user.tag}*** **You do not have permissions to ban** ***${person.user.tag}***`).setColor('BLUE').setTimestamp();
            return message.channel.send(messEmbednow);
        }
    },
};
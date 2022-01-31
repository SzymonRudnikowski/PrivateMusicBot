const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const XLSX = require('xlsx');

const PATH = "./MLE/Zawodnicy_CSGO.xlsx";

module.exports = {
    name: 'win',
    aliases: [],
    async execute(message, args, com, client) {
        if (message.guild.id !== '914969283661037618') return;
        if (!message.member.hasPermission(['ADMINISTRATOR'])) {
            const messEmbednow = new MessageEmbed()
                .setTitle(`***${message.author.tag}*** **you don't have permissions to execute this command!**`).setColor('RED').setTimestamp();
            return message.channel.send(messEmbednow);
        }

        let winning_team = args.join().substr(0, args.join().indexOf('/')).replace(/,/g, ' ');
        console.log(winning_team);

        if (!winning_team.length) {
            const messEmbednow = new MessageEmbed()
                .setTitle(`***${message.author.tag}*** **you have to specify the name of the winning team**`).setColor('BLUE').setTimestamp();
            return message.channel.send(messEmbednow);
        }

        const workbook = XLSX.readFile(PATH);
        let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let data = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
        let foundTeams = {
            team1: false //winning team
        }
        let max_array_length = 0;

        for (let i = 0; i < data.length; i++) {
            let array = data[i];
            if (array.length) {
                if (array[0].toLowerCase() === winning_team.toLowerCase()) {
                    array[2] += parseInt(3);
                    array[3] += parseInt(0);
                    array[4] += parseInt(0);
                    array[5] = (parseInt(array[2]) / parseInt(array[4])).toFixed(2);
                    array.push(parseInt(3));
                    array.push(parseInt(0));
                    array.push(parseInt(0));
                    foundTeams.team1 = true;
                    if (max_array_length < array.length) max_array_length = array.length;
                    console.log(array, "got awarded 3 kills cause his team won by walkover cause odd number of teams")
                }
                array[5] = parseFloat(array[5]).toFixed(2);
            }
        }

        let queueNumber;
        fs.readFile(`./MLE/settings.json`, 'utf-8', (err, data) => {
            if (err) {
                console.log('Error while reading the file');
            } else {
                const settings = JSON.parse(data.toString());
                queueNumber = settings.currentQueue;

            }
        });

        setTimeout(() => {
            console.log("max array length: ", max_array_length)
            if ((max_array_length - 6) / 3 > queueNumber) {
                const messEmbednow = new MessageEmbed()
                    .setTitle(`**That team has already played their games during this queue!**`).setColor('RED').setTimestamp();
                return message.channel.send(messEmbednow);
            }
            if (!foundTeams.team1) {
                const messEmbednow = new MessageEmbed()
                    .setTitle(`**Team called** ***${winning_team}*** **does not exist!**`).setColor('RED').setTimestamp();
                return message.channel.send(messEmbednow);
            }
            let worksheet = XLSX.utils.aoa_to_sheet(data);
            let new_workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(new_workbook, worksheet, "Arkusz1");
            XLSX.writeFile(new_workbook, PATH);

            const messEmbednow = new MessageEmbed()
                .setTitle(`**Stats have been successfully updated**`).setColor('GREEN').setTimestamp();
            return message.channel.send(messEmbednow);
        }, 1000);


    },
};
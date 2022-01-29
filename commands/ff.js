const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const fetch = require("node-fetch");
const XLSX = require('xlsx');

const PATH = "./Zawodnicy_CSGO.xlsx";

module.exports = {
    name: 'ff',
    aliases: [],
    async execute(message, args, com, client) {

        //!ff nazwa_team1/nazwa_team2 
        if (args.join().indexOf('/') === -1) {
            const messEmbednow = new MessageEmbed()
                .setTitle(`***${message.author.tag}*** **syntax you entered is not valid!**`).setColor('RED').setTimestamp();
            return message.channel.send(messEmbednow);
        }

        let winning_team = args.join().substr(args.join().indexOf('/') + 1, args.join().length).replace(/,/g, ' ');
        console.log(winning_team);

        let losing_team = args.join().substr(0, args.join().indexOf('/')).replace(/,/g, ' ');
        console.log(losing_team);

        if (!winning_team.length) {
            const messEmbednow = new MessageEmbed()
                .setTitle(`***${message.author.tag}*** **you have to specify the name of the winning team**`).setColor('BLUE').setTimestamp();
            return message.channel.send(messEmbednow);
        }
        if (!losing_team.length) {
            const messEmbednow = new MessageEmbed()
                .setTitle(`***${message.author.tag}*** **you have to specify the name of the losing team**`).setColor('BLUE').setTimestamp();
            return message.channel.send(messEmbednow);
        }

        const workbook = XLSX.readFile(PATH);
        let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let data = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });

        for (let i = 0; i < data.length; i++) {
            let array = data[i];
            console.log(array.length, queueNumber * 3 + 6);
            if (array.length) {
                if (array.length === (queueNumber - 2) * 3 + 6) {
                    array[2] += parseInt(0);
                    array[3] += parseInt(0);
                    array[4] += parseInt(0);
                    array[5] = (parseInt(array[2]) / parseInt(array[4])).toFixed(2);
                    array.push(parseInt(0));
                    array.push(parseInt(0));
                    array.push(parseInt(0));
                    console.log(array, "got filled with 0 cause no game was played")
                } else {
                    array[5] = parseFloat(array[5]).toFixed(2);
                }
            }

        }
        let worksheet = XLSX.utils.aoa_to_sheet(data);
        let new_workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(new_workbook, worksheet, "Arkusz1");
        XLSX.writeFile(new_workbook, PATH)



    },
};
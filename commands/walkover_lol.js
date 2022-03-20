const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const XLSX = require('xlsx');

const PATH = './MLE/Zawodnicy_LOL.xlsx';

module.exports = {
  name: 'walkover_lol',
  aliases: [],
  async execute(message, args, com, client) {
    if (message.guild.id !== '914969283661037618') return;
    if (!message.member.hasPermission(['ADMINISTRATOR'])) {
      const messEmbednow = new MessageEmbed()
        .setTitle(
          `***${message.author.tag}*** **you don't have permissions to execute this command!**`
        )
        .setColor('RED')
        .setTimestamp();
      return message.channel.send(messEmbednow);
    }

    if (args.join().indexOf('/') === -1) {
      const messEmbednow = new MessageEmbed()
        .setTitle(
          `***${message.author.tag}*** **syntax you entered is not valid! (valid syntax under !help_mle)**`
        )
        .setColor('RED')
        .setTimestamp();
      return message.channel.send(messEmbednow);
    }

    let losing_team = args
      .join()
      .substr(args.join().indexOf('/') + 1, args.join().length)
      .replace(/,/g, ' ');
    console.log(losing_team);

    let winning_team = args.join().substr(0, args.join().indexOf('/')).replace(/,/g, ' ');
    console.log(winning_team);

    if (!winning_team.length) {
      const messEmbednow = new MessageEmbed()
        .setTitle(
          `***${message.author.tag}*** **you have to specify the name of the winning team**`
        )
        .setColor('BLUE')
        .setTimestamp();
      return message.channel.send(messEmbednow);
    }
    if (!losing_team.length) {
      const messEmbednow = new MessageEmbed()
        .setTitle(`***${message.author.tag}*** **you have to specify the name of the losing team**`)
        .setColor('BLUE')
        .setTimestamp();
      return message.channel.send(messEmbednow);
    }

    const workbook = XLSX.readFile(PATH);
    let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let data = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
    let foundTeams = {
      team1: false, //winning team
      team2: false, //losing team
    };
    let max_array_length = 0;

    for (let i = 0; i < data.length; i++) {
      let array = data[i];
      if (array.length) {
        if (array[0].toLowerCase() === winning_team.toLowerCase()) {
          array[2] += 3;
          array[3] += 0;
          array[4] += 0;
          array[6] = ((parseInt(array[2]) + parseInt(array[3])) / parseInt(array[4])).toFixed(2); //KDA
          array.push(3);
          array.push(0);
          array.push(0);
          array.push(parseFloat('5.0').toFixed(2));
          let cs_sum = 0;
          let number_of_games = 0;
          for (let i = 16; i < array.length; i += 4) {
            cs_sum += array[i];
            number_of_games++;
          }
          array[5] = parseFloat(cs_sum / number_of_games).toFixed(2);
          foundTeams.team1 = true;
          if (max_array_length < array.length) max_array_length = array.length;
          console.log(array, 'got awarded 3 kills cause his team won by walkover');
        } else if (array[0].toLowerCase() === losing_team.toLowerCase()) {
          array[2] += 0;
          array[3] += 0;
          array[4] += 0;
          array[6] = ((parseInt(array[2]) + parseInt(array[3])) / parseInt(array[4])).toFixed(2); //KDA
          array.push(0);
          array.push(0);
          array.push(0);
          array.push(parseFloat('0.0').toFixed(2));
          let cs_sum = 0;
          let number_of_games = 0;
          for (let i = 16; i < array.length; i += 4) {
            cs_sum += parseFloat(array[i]);
            number_of_games++;
          }
          array[5] = parseFloat(cs_sum / number_of_games).toFixed(2);
          if (max_array_length < array.length) max_array_length = array.length;
          console.log(array, 'got awarded 0 kills cause his team lost by walkover');
          foundTeams.team2 = true;
        } else {
          array[6] = parseFloat(array[6]).toFixed(2);
          array[5] = parseFloat(array[5]).toFixed(2);
        }
      }
    }

    let queueNumber;
    fs.readFile(`./MLE/settings.json`, 'utf-8', (err, data) => {
      if (err) {
        console.log('Error while reading the file');
      } else {
        const settings = JSON.parse(data.toString());
        queueNumber = settings.currentQueueLOL;
      }
    });

    setTimeout(() => {
      console.log('max array length: ', max_array_length);
      console.log(foundTeams.team1, foundTeams.team2);

      if (!foundTeams.team1) {
        const messEmbednow = new MessageEmbed()
          .setTitle(`**Team called** ***${winning_team}*** **does not exist!**`)
          .setColor('RED')
          .setTimestamp();
        return message.channel.send(messEmbednow);
      }
      if (!foundTeams.team2) {
        const messEmbednow = new MessageEmbed()
          .setTitle(`**Team called** ***${losing_team}*** **does not exist!**`)
          .setColor('RED')
          .setTimestamp();
        return message.channel.send(messEmbednow);
      }

      if ((max_array_length - 13) / 4 > queueNumber - 2) {
        const messEmbednow = new MessageEmbed()
          .setTitle(`**These teams have already played their games during this queue!**`)
          .setColor('RED')
          .setTimestamp();
        return message.channel.send(messEmbednow);
      }
      let worksheet = XLSX.utils.aoa_to_sheet(data);
      let new_workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(new_workbook, worksheet, 'Arkusz1');
      XLSX.writeFile(new_workbook, PATH);

      const messEmbednow = new MessageEmbed()
        .setTitle(`**Stats have been successfully updated**`)
        .setColor('GREEN')
        .setTimestamp();
      return message.channel.send(messEmbednow);
    }, 1000);
  },
};

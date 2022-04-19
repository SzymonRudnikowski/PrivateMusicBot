const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const XLSX = require('xlsx');
const fs = require('fs');

const PATH = './MLE/TeamsRegistered.xlsx';

module.exports = {
  name: 'register_mle',
  description: 'registration process for mle server',
  permissions: [],
  async execute(message, args, com, client) {
    if (message.guild.id !== '914969283661037618') return;
    if (!args.length || !args[0].length) {
      const messEmbednow = new MessageEmbed()
        .setTitle(`***${message.author.tag}*** **you need to enter an id!**`)
        .setColor('BLUE')
        .setTimestamp();
      return message.channel.send(messEmbednow);
    }
    const id = args[0];
    if (
      id.length !== 6 ||
      id.match(/[^a-zA-Z0-9]+/g) ||
      (!id.startsWith('CS') && !id.startsWith('LO') && !id.startsWith('VA')) ||
      (id[2] !== 'K' && id[2] !== 'Z')
    ) {
      const messEmbednow = new MessageEmbed()
        .setTitle(`**That is not a valid id!**`)
        .setColor('RED')
        .setTimestamp();
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

    setTimeout(() => {
      if (!idFree) {
        const messEmbednow = new MessageEmbed()
          .setTitle(`**This id has already been used!**`)
          .setColor('RED')
          .setTimestamp();
        return message.channel.send(messEmbednow);
      } else {
        fs.readFile(`./MLE/already_registered.txt`, 'utf-8', (err, data) => {
          if (err) {
            console.log(err);
            console.log('Error while reading the file');
          } else {
            const ids = JSON.parse(data.toString());
            ids.push(id);
            const return_string = JSON.stringify(ids, null, 4);
            console.log(return_string);
            fs.writeFile('./MLE/already_registered.txt', return_string, (err) => {
              if (err) {
                console.log('error adding id to the registry');
              } else {
                console.log('id added to the registry');
              }
            });
          }
        });
      }
      const userID = message.author.id;
      const member = message.guild.members.cache.get(userID);
      const usersNickname = member.displayName;

      let mainRole;
      let categoryRole;
      try {
        if (id.startsWith('CS')) {
          //csgo
          categoryRole = message.guild.roles.cache.find((role) => role.name === 'CS:GO');
          if (id[2] === 'K') {
            //kapitan
            mainRole = message.guild.roles.cache.find((role) => role.name === 'Kapitan');
          } else {
            //zawodnik
            mainRole = message.guild.roles.cache.find((role) => role.name === 'Zawodnik');
          }
        } else if (id.startsWith('LO')) {
          //lol
          categoryRole = message.guild.roles.cache.find(
            (role) => role.name === 'League of Legends'
          );

          if (id[2] === 'K') {
            //kapitan
            mainRole = message.guild.roles.cache.find((role) => role.name === 'Kapitan');
          } else {
            //zawodnik
            mainRole = message.guild.roles.cache.find((role) => role.name === 'Zawodnik');
          }
        } else {
          categoryRole = message.guild.roles.cache.find((role) => role.name === 'Valorant');

          if (id[2] === 'K') {
            //kapitan
            mainRole = message.guild.roles.cache.find((role) => role.name === 'Kapitan');
          } else {
            //zawodnik
            mainRole = message.guild.roles.cache.find((role) => role.name === 'Zawodnik');
          }
        } //valorant
        member.roles.add([mainRole, categoryRole]);
      } catch (error) {
        console.log(error);
        const messEmbednow = new MessageEmbed()
          .setTitle(
            `**There was an error during registration process. Please contact server staff for help.**`
          )
          .setColor('RED')
          .setTimestamp();
        return message.channel.send(messEmbednow);
      }

      const workbook = XLSX.readFile(PATH);

      let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
      let data = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });

      let idExist = false;

      for (let i = 0; i < data.length; i++) {
        let array = data[i];
        if (array.length) {
          if (array[1].toString() === id.toString()) {
            array.push(usersNickname);
            array.push(userID.toString());
            array.push(mainRole.name === 'Kapitan' ? 'true' : 'false');
            idExist = true;
          }
        }
      }
      if (!idExist) {
        const messEmbednow = new MessageEmbed()
          .setTitle(`**This id does not exist!**`)
          .setColor('RED')
          .setTimestamp();
        return message.channel.send(messEmbednow);
      }

      let worksheet = XLSX.utils.aoa_to_sheet(data);
      let new_workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(new_workbook, worksheet, 'Arkusz1');
      XLSX.writeFile(new_workbook, PATH);

      const messEmbednow = new MessageEmbed()
        .setTitle(`**Successfuly registered! Category: ${categoryRole.name}**`)
        .setColor('GREEN')
        .setTimestamp();
      return message.channel.send(messEmbednow);
    }, 100);
  },
};

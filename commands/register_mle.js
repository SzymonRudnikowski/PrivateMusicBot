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

    let mainRole;
    let categoryRole;
    const guestRole = message.guild.roles.cache.find((role) => role.name === 'Go\u015B\u0107');

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

    for (let i = 0; i < data.length; i++) {
      let array = data[i];
      if (array.length) {
        if (
          array[3] &&
          array[3].toString() === message.author.id.toString() &&
          ((id.startsWith('LO') && array[1].startsWith('LO')) ||
            (id.startsWith('CS') && array[1].startsWith('CS')) ||
            (id.startsWith('VA') && array[1].startsWith('VA')))
        ) {
          const messEmbednow = new MessageEmbed()
            .setTitle(`**You have already registered for this category! (${categoryRole})**`)
            .setColor('RED')
            .setTimestamp();
          return message.channel.send(messEmbednow);
        }
      }
    }

    setTimeout(() => {
      if (!idFree) {
        const messEmbednow = new MessageEmbed()
          .setTitle(`**This id has already been used!**`)
          .setColor('RED')
          .setTimestamp();
        return message.channel.send(messEmbednow);
      }
      const userID = message.author.id;
      const member = message.guild.members.cache.get(userID);
      const usersNickname = message.author.tag;

      let idExist = false;

      for (let i = 0; i < data.length; i++) {
        let array = data[i];
        if (array.length) {
          if (array[1].toString() === id.toString()) {
            array.push(usersNickname);
            array.push(userID.toString());
            array.push(mainRole.name.includes('Kapitan') ? 'true' : 'false');
            member
              .setNickname(array[0].toString())
              .then(() => {
                console.log('nickname set:', array[0].toString());
              })
              .catch((err) => {
                console.log(err);
                const messEmbednow = new MessageEmbed()
                  .setTitle(
                    `**There was an error during registration process. Please contact <@391983289122029578>**`
                  )
                  .setColor('RED')
                  .setTimestamp();
                return message.channel.send(messEmbednow);
              });
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

      member.roles
        .add(mainRole)
        .then(() => {
          console.log('proper role added');
        })
        .catch((err) => {
          console.log(err);
          const messEmbednow = new MessageEmbed()
            .setTitle(
              `**There was an error during registration process. Please contact <@391983289122029578>**`
            )
            .setColor('RED')
            .setTimestamp();
          return message.channel.send(messEmbednow);
        });
      member.roles
        .remove(guestRole)
        .then(() => {
          console.log('proper role added');
        })
        .catch((err) => {
          console.log(err);
          const messEmbednow = new MessageEmbed()
            .setTitle(
              `**There was an error during registration process. Please contact <@391983289122029578>**`
            )
            .setColor('RED')
            .setTimestamp();
          return message.channel.send(messEmbednow);
        });

      fs.readFile(`./MLE/already_registered.txt`, 'utf-8', (err, data) => {
        if (err) {
          console.log(err);
          console.log('Error while reading the file');
        } else {
          const ids = JSON.parse(data.toString());
          ids.push(id);
          const return_string = JSON.stringify(ids, null, 4);
          fs.writeFile('./MLE/already_registered.txt', return_string, (err) => {
            if (err) {
              console.log('error adding id to the registry');
            } else {
              console.log('id added to the registry');
            }
          });
        }
      });

      let worksheet = XLSX.utils.aoa_to_sheet(data);
      let new_workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(new_workbook, worksheet, 'Arkusz1');
      XLSX.writeFile(new_workbook, PATH);

      const messEmbednow = new MessageEmbed()
        .setTitle(`**Successfully registered! Category: ${categoryRole}**`)
        .setColor('GREEN')
        .setTimestamp();
      return message.channel.send(messEmbednow);
    }, 100);
  },
};

const fs = require('fs');
const Discord = require('discord.js');
const util = require('minecraft-server-util');
const config = require('./config.json');
const XLSX = require('xlsx');
const { MessageEmbed } = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
client.aliases = new Discord.Collection();

let commandUsedRecently = new Map();
let mutedUsers = new Map();
let mutedUsersCurrently = new Set();
global.hasJoinedChannel = new Map();

const PATH_LOL = './MLE/Zawodnicy_LOL.xlsx';
const PATH_CSGO = './MLE/Zawodnicy_CSGO.xlsx';

let intervals = [30000, 60000, 300000, 1800000, 3600000, 10800000, 43200000, 86400000];
//    30s    60s    5min    30min    1hour    3hours    12hours   24hours
//const BOT_ID = "892442837252206633";
const BOT_ID = config.id;
//btw simon is a ni33er

global.prefix = config.prefix; //jak chcesz do dev to tak jak wszedzie masz prefixdev

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('to music...', {
    type: 'LISTENING',
    url: 'https://discord.gg/bzYXx8t3fE',
  });
});

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);

  if (command.aliases) {
    command.aliases.forEach((alias) => {
      client.aliases.set(alias, command);
    });
  }
}

client.on('voiceStateUpdate', (oldState, newState) => {
  if (!hasJoinedChannel.has(oldState.guild.id)) return;

  if (
    (oldState.channelID != null &&
      newState.channelID != null &&
      newState.channelID != oldState.channelID) ||
    newState.channelID === null
  ) {
    console.log('someone left or switched channels');
    if (oldState.member.id === client.user.id) {
      console.log('this was me who got disconnected');
      hasJoinedChannel.delete(oldState.guild.id);
      return;
    }
    if (oldState.channel.members.size - 1 === 0) {
      console.log('no users in a channel, leaving in 5 secs');
      setTimeout(() => {
        if (oldState.channel.members.size - 1 === 0) {
          console.log('No users in the channel, leaving it');
          if (songTitles.has(oldState.guild.id)) songTitles.delete(oldState.guild.id);
          if (YoutubeTitle.has(oldState.guild.id)) YoutubeTitle.delete(oldState.guild.id);
          if (looped.has(oldState.guild.id)) looped.delete(oldState.guild.id);
          if (queue.has(oldState.guild.id)) queue.delete(oldState.guild.id);
          if (hasJoinedChannel.has(oldState.guild.id)) hasJoinedChannel.delete(oldState.guild.id);
          return oldState.channel.leave();
        } else {
          console.log('still someone in the channel');
        }
      }, 5000);
    }
  }
});

function endQueueZeroAdd_CSGO(statsEnabled, queueNumber) {
  if (!statsEnabled) {
    console.log('its monday but stats in cs are off');
    return;
  }
  const workbook = XLSX.readFile(PATH_CSGO);
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
        console.log(array, 'got filled with 0 cause no game was played');
      } else {
        array[5] = parseFloat(array[5]).toFixed(2);
      }
    }
  }
  let worksheet = XLSX.utils.aoa_to_sheet(data);
  let new_workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(new_workbook, worksheet, 'Arkusz1');
  XLSX.writeFile(new_workbook, PATH_CSGO);
}

function endQueueZeroAdd_LOL(statsEnabled, queueNumber) {
  if (!statsEnabled) {
    console.log('its monday but stats in lol are off');
    return;
  }
  const workbook = XLSX.readFile(PATH_LOL);
  let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
  let data = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });

  for (let i = 0; i < data.length; i++) {
    let array = data[i];
    if (array.length) {
      if (array.length === 13 + (queueNumber - 4) * 4) {
        array[2] += parseInt(0);
        array[3] += parseInt(0);
        array[4] += parseInt(0);
        array[6] = ((parseInt(array[2]) + parseInt(array[3])) / parseInt(array[4])).toFixed(2); //KDA
        array.push(parseInt(0));
        array.push(parseInt(0));
        array.push(parseInt(0));
        array.push(parseFloat(0.0).toFixed(2));
        let cs_sum = 0;
        let number_of_games = 0;
        for (let i = 16; i < array.length; i += 4) {
          cs_sum += array[i];
          number_of_games++;
        }
        array[5] = parseFloat(cs_sum / number_of_games).toFixed(2);
        console.log(array[1], 'got filled with 0 cause no game was played');
      } else {
        array[6] = parseFloat(array[6]).toFixed(2);
      }
    }
  }
  let worksheet = XLSX.utils.aoa_to_sheet(data);
  let new_workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(new_workbook, worksheet, 'Arkusz1');
  XLSX.writeFile(new_workbook, PATH_LOL);
}

client.setInterval(() => {
  mutedUsers.clear();
  console.log('muted registry cleared | map size: ' + mutedUsers.size);
}, 86400000); //clear mute stage every day 86400000

client.setInterval(() => {
  let date = new Date();
  let day = date.getDay();
  let hour = date.getHours(); //kiedy stats sa off to nie zmienia
  let queueNumberCSGO;
  let queueNumberLOL;
  let statsEnabledFileCSGO = true;
  let statsEnabledFileLOL = true;
  console.log(day, hour);
  if (day === 1 && hour === 0) {
    fs.readFile(`./MLE/settings.json`, 'utf-8', (err, data) => {
      if (err) {
        console.log('Error while reading the file', err);
      } else {
        let settings = JSON.parse(data.toString());
        statsEnabledFileCSGO = settings.statsEnabled;
        statsEnabledFileLOL = settings.statsEnabledLOL;

        if (settings.statsEnabled || settings.statsEnabledLOL) {
          if (settings.statsEnabled) {
            settings.currentQueue++;
            console.log('cs queue number incremented');
          }
          if (settings.statsEnabledLOL) {
            settings.currentQueueLOL++;
            console.log('lol queue number incremented');
          }

          const return_string = JSON.stringify(settings, null, 4);
          fs.writeFile(`./MLE/settings.json`, return_string, (err) => {
            if (err) {
              console.log('error while writing the file', err);
            } else {
              console.log('queue number got changed cause its monday');
            }
          });
        } else {
          console.log('not changed actually cause cs is off');
        }

        queueNumberCSGO = settings.currentQueue;
        queueNumberLOL = settings.currentQueueLOL;
      }
    });

    setTimeout(() => {
      endQueueZeroAdd_CSGO(statsEnabledFileCSGO, queueNumberCSGO);
      endQueueZeroAdd_LOL(statsEnabledFileLOL, queueNumberLOL);
    }, 1000);
  }
}, 3600000); // check every hour if new queue should be turned on

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || mutedUsersCurrently.has(message.author.id)) return;

  if (!commandUsedRecently.has(message.author.id)) commandUsedRecently.set(message.author.id, 1);

  if (commandUsedRecently.get(message.author.id) === 3) {
    console.log(mutedUsers.has(message.author.id));
    if (mutedUsers.has(message.author.id))
      mutedUsers.set(message.author.id, mutedUsers.get(message.author.id) + 1);
    else mutedUsers.set(message.author.id, 0);
    console.log(mutedUsers.has(message.author.id));
    const messEmbednow = new MessageEmbed().setColor('BLUE').setTimestamp();

    if (intervals[mutedUsers.get(message.author.id)] / 1000 <= 60)
      messEmbednow.setTitle(
        `**You are sending messages too fast! Try again in ${
          intervals[mutedUsers.get(message.author.id)] / 1000
        } seconds**`
      );
    else if (
      intervals[mutedUsers.get(message.author.id)] / 1000 > 60 &&
      intervals[mutedUsers.get(message.author.id)] / 1000 <= 1800
    )
      messEmbednow.setTitle(
        `**You are sending messages too fast! Try again in ${
          intervals[mutedUsers.get(message.author.id)] / 1000 / 60
        } minutes**`
      );
    else if (intervals[mutedUsers.get(message.author.id)] / 1000 === 3600)
      messEmbednow.setTitle(
        `**You are sending messages too fast! Try again in ${
          intervals[mutedUsers.get(message.author.id)] / 1000 / 60 / 60
        } hour**`
      );
    else if (intervals[mutedUsers.get(message.author.id)] / 1000 > 1800)
      messEmbednow.setTitle(
        `**You are sending messages too fast! Try again in ${
          intervals[mutedUsers.get(message.author.id)] / 1000 / 60 / 60
        } hours**`
      );

    message.channel.send(messEmbednow);
    mutedUsersCurrently.add(message.author.id);

    setTimeout(() => {
      // Removes the user from the set after proper amount of time
      commandUsedRecently.set(message.author.id, 0);
      mutedUsersCurrently.delete(message.author.id);
    }, intervals[mutedUsers.get(message.author.id)]);

    console.log(`[${message.author.tag}] in [${message.guild.name}] is spamming, blocked`);
    return;
  } else {
    /*if(!fs.existsSync(`./jsons/${message.member.guild.id}.json`)) {
          message.channel.send('**This server is not authorized!**')
          return; 
        } 
        */
    let userID = message.author.id;
    if (userID == BOT_ID) return;

    commandUsedRecently.set(message.author.id, commandUsedRecently.get(message.author.id) + 1);
    const version = 'Version 0.2';
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const com = client.commands.get(command) || client.aliases.get(command);

    if (!client.aliases.has(command) && !client.commands.has(command)) {
      const embed = new Discord.MessageEmbed()
        .setColor('0x03f4fc')
        .setTitle('Command does not exist!')
        .setDescription(`**There is no command \"${command}\"\n For help type !help**`)
        .setFooter('PMB');

      ///return message.channel.send(embed);
      return console.log('Incorrect command.');
    }

    /*
        if((message.author.id != '391983289122029578' && message.author.id != '259046058737270784') && !fs.existsSync(`./jsons/${message.member.guild.id}.json`)) {
          message.channel.send('**This server is not authorized!**')
          return; 
        } 
        */

    client.setTimeout(function () {
      setTimeout(function () {
        commandUsedRecently.set(message.author.id, 0);
      }, 2000);
    });

    try {
      com.execute(message, args, com, client);
    } catch (error) {
      console.error(error);
      const messEmbednow = new MessageEmbed()
        .setTitle(`**There was an issue executing this command!**`)
        .setColor('BLUE')
        .setTimestamp();
      message.channel.send(messEmbednow);
    }
  }
});

//client.login("ODkyNDQyODM3MjUyMjA2NjMz.YVM-KQ.D1qaqUjLmd_KWQsCVFPjPDOk7c8");
client.login(config.token);

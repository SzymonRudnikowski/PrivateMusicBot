const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const XLSX = require('xlsx');

const PATH_LOL = './MLE/Zawodnicy_LOL.xlsx';
const PATH_CSGO = './MLE/Zawodnicy_CSGO.xlsx';
const PATH_DISPLAY_CSGO = './MLE/DisplaySheetCSGO.xlsx';
const PATH_DISPLAY_LOL = './MLE/DisplaySheetLOL.xlsx';

module.exports = {
  name: 'create-display-sheet-csgo',
  description: '',
  permissions: [],
  async execute(message, args, com, client) {
    createDisplaySheetCSGO(true, 2);
  },
};

function createDisplaySheetCSGO(statsEnabled, queueNumber) {
  if (!statsEnabled) {
    console.log('its monday but stats in csgo display sheet are off');
    return;
  }
  const workbook = XLSX.readFile(PATH_CSGO);
  let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
  let data = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });

  let displayData = [
    [
      'Position',
      'Player',
      'Team',
      'Score',
      'Total Kills',
      'Total Assists',
      'Total Deaths',
      'Total KD',
      'Total HS%',
      `${queueNumber}. Kills`,
      `${queueNumber}. Assists`,
      `${queueNumber}. Deaths`,
      `${queueNumber}. KD`,
      `${queueNumber}. HS%`,
    ],
  ];
  for (let i = 1; i < data.length; i++) {
    const array = data[i];
    if (array.length) {
      let playerData = [-1]; //since position is gonna get changed after sorting everything
      for (let j = 0; j < 7; j++) {
        playerData.push(array[j]); //total stats
      }
      const temp = playerData[1]; //team name
      playerData[1] = playerData[2]; //swapping team name with player name
      playerData[2] = temp;

      const score = (playerData[3] + playerData[4] / 2) * playerData[6]; // these indexes are proper as we havent yet added score to the array
      playerData.splice(3, 0, score); //score (total kills + total assists/2) * total kd

      for (let j = 7 + (queueNumber - 1) * 5; j < 7 + (queueNumber - 1) * 5 + 5; j++) {
        playerData.push(array[j]); //stats for this particular queue
      }
      displayData.push(playerData);
    }
  }

  displayData.sort((a, b) => {
    return b[3] - a[3]; //descending order
  });

  for (let i = 1; i < displayData.length; i++) {
    displayData[i][0] = i; //position number
  }

  let worksheet = XLSX.utils.aoa_to_sheet(displayData);
  let new_workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(new_workbook, worksheet, 'Arkusz1');
  XLSX.writeFile(new_workbook, PATH_DISPLAY_CSGO);
}

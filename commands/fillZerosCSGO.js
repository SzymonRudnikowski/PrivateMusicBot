const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const XLSX = require('xlsx');

const PATH_CSGO = './MLE/Zawodnicy_CSGO.xlsx';

module.exports = {
  name: 'fill-zeros-csgo',
  description: '',
  permissions: [],
  async execute(message, args, com, client) {
    endQueueZeroAdd_CSGO(true, 2);
  },
};

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
    console.log(array.length, queueNumber * 5 + 7);
    if (array.length) {
      if (array.length === (queueNumber - 1) * 5 + 7) {
        array[2] += parseInt(0);
        array[3] += parseInt(0);
        array[4] += parseInt(0);

        let divideBy = !parseInt(array[4]) ? 1 : parseInt(array[4]);
        array[5] = (parseInt(array[2]) / divideBy).toFixed(2); //kd

        array.push(0);
        array.push(0);
        array.push(0);
        array.push(0);
        array.push(0);

        let total_kd = 0;
        let rounds = 0;

        for (let i = 11; i < array.length; i += 5) {
          total_kd += array[i];
          rounds++;
        }
        array[6] = (parseFloat(total_kd) / parseFloat(rounds)).toFixed(2);
        console.log(array[1], 'got filled with 0 cause no game was played');
      }
    }
  }
  let worksheet = XLSX.utils.aoa_to_sheet(data);
  let new_workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(new_workbook, worksheet, 'Arkusz1');
  XLSX.writeFile(new_workbook, PATH_CSGO);
}

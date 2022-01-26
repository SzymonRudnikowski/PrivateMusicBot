const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const fetch = require("node-fetch");
const XLSX = require('xlsx');

const KEY = 'f5abf8c7-628c-47d7-a46d-eb4a2788fc26'

const headerFaceit = {
    Authorization: `Bearer ${KEY}`
}

let good = new Map();
let right_players = new Map();
const PATH = "./Zawodnicy_CSGO.xlsx";

async function getTables(matchID, message) {
    const workbook = XLSX.readFile(PATH)
    let res;
    //getting the json response from faceit api
    await fetch('https://open.faceit.com/data/v4/matches/' + matchID + '/stats', {
            method: 'GET',
            headers: headerFaceit
        })
        .then(function(u) { return u.json(); })
        .then(function(json) {
            res = json;
        })
    console.log(res);

    try {
        let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let data = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
        let players_right = new Map(); //keeps track about number of players that differs in each team maximum 1 per team
        res.rounds[0]["teams"].forEach(team => {
            let team_name = team.team_stats.Team;
            let players = [];
            if (!players_right.has(team_name)) {
                players_right.set(team_name, 0);
            }

            //getting match stats from faceit api
            team.players.forEach(player => {
                let nickname = player.nickname;
                let hs = player.player_stats['Headshots %'];
                let kills = player.player_stats["Kills"];
                let assists = player.player_stats["Assists"];
                let deaths = player.player_stats["Deaths"];
                let kd = player.player_stats['K/D Ratio'];

                let player_info = {
                    nickname: nickname,
                    hs: hs,
                    kills: kills,
                    assists: assists,
                    deaths: deaths,
                    kd: kd,
                }
                players.push(player_info);

            })
            let team_name_excel;
            players.forEach(player => {
                let nickname = player.nickname;
                let kills = player.kills;
                let assists = player.assists
                let deaths = player.deaths;
                //appending stats from faceit api to the excel worksheet

                for (let i = 0; i < data.length; i++) {
                    let array = data[i];

                    if (array.length) {
                        if (array[1].replace(/"/g, '') === nickname) {
                            console.log("found: " + nickname);
                            team_name_excel = array[0];
                            array[2] += parseInt(kills);
                            array[3] += parseInt(assists);
                            array[4] += parseInt(deaths);
                            array[5] = (parseInt(array[2]) / parseInt(array[4])).toFixed(2);
                            array.push(parseInt(kills));
                            array.push(parseInt(assists));
                            array.push(parseInt(deaths));
                            players_right.set(team_name, players_right.get(team_name) + 1);
                            break;
                        } else {
                            array[5] = parseFloat(array[5]).toFixed(2);
                        }
                    }

                }

            })
            if (players_right.get(team_name) < 4) {
                right_players.set(message.guild.id, false);
                return;
            } else {
                players_right.delete(team_name);
            }
            let whole_team = [];
            data.forEach(array => {
                if (array.length) {
                    if (array[0] === team_name_excel) {
                        whole_team.push(array);
                    }
                }
            })

            let max_length = 0;
            whole_team.forEach(teammate => {
                if (max_length < teammate.length) {
                    max_length = teammate.length;
                }
            });
            whole_team.forEach(teammate => {
                if (teammate.length < max_length) {
                    teammate.push(0);
                    teammate.push(0);
                    teammate.push(0);
                    console.log(teammate[1], " got only 0")
                }
            });
            whole_team = [];
            players = [];
        });
        if (!right_players.get(message.guild.id)) {
            return;
        }
        let worksheet = XLSX.utils.aoa_to_sheet(data);
        let new_workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(new_workbook, worksheet, "Arkusz1");
        XLSX.writeFile(new_workbook, PATH)
    } catch (err) {
        console.log(err);
        console.log("not found");
        good.set(message.guild.id, false);
        return;
    }
    good.set(message.guild.id, true);
    right_players.set(message.guild.id, true);
}



module.exports = {
    name: 'wynik',
    aliases: [],
    async execute(message, args, com, client) {
        if (!args.length || !args[0].length) {
            const messEmbednow = new MessageEmbed()
                .setTitle(`***${message.author.tag}*** **you need to enter a link!**`).setColor('BLUE').setTimestamp();
            return message.channel.send(messEmbednow);
        }
        console.log(args[0])

        if (!args[0].startsWith('https://faceitstats.com/match/') && !args[0].startsWith('https://www.faceit.com/pl/csgo/room/')) {
            console.log("link not valid")
            const messEmbednow = new MessageEmbed()
                .setTitle(`***${message.author.tag}*** **your link is not valid!**`).setColor('RED').setTimestamp();
            return message.channel.send(messEmbednow);
        }
        let link = args[0];
        let exist = false;
        let matchID;

        matchID = link.substring(link.indexOf('1-'), link.indexOf('1-') + 38);

        if (fs.existsSync(`./jsons_playlists/urls.txt`)) {
            fs.readFile(`./jsons_playlists/urls.txt`, 'utf-8', (err, data) => {
                if (err) {
                    console.log('Error while reading the file');
                } else {
                    const links = JSON.parse(data.toString());
                    links.forEach(matchidTXT => {
                        if (matchidTXT === matchID) {
                            exist = true;
                            const messEmbednow = new MessageEmbed()
                                .setTitle(`**This link has already been uploaded!**`).setColor('RED').setTimestamp();
                            message.channel.send(messEmbednow);
                        }
                    })

                }
            });
        }
        if (!good.has(message.guild.id)) good.set(message.guild.id, true);
        if (!right_players.has(message.guild.id)) right_players.set(message.guild.id, true);


        setTimeout(async() => {
            if (!exist) {

                console.log(matchID);
                await getTables(matchID, message);

                if (!right_players.get(message.guild.id)) {
                    const messEmbednow = new MessageEmbed()
                        .setTitle(`**The number of players who are not participating in the tournament cannot exceed 1 per team!**`).setColor('RED').setTimestamp();
                    return message.channel.send(messEmbednow);
                }

                if (!good.get(message.guild.id)) {
                    const messEmbednow = new MessageEmbed()
                        .setTitle(`**Game under this link does not exist! Enter a valid link**`).setColor('RED').setTimestamp();
                    return message.channel.send(messEmbednow);
                }

                if (!fs.existsSync(`./jsons_playlists/urls.txt`)) {
                    fs.writeFile(`./jsons_playlists/urls.txt`, '[]', err => {
                        if (err) {
                            console.log('Error writing file', err)
                        } else {
                            console.log("created file")
                        }
                    });
                }
                fs.readFile(`./jsons_playlists/urls.txt`, 'utf-8', (err, data) => {
                    if (err) {
                        console.log("Error while reading the file");
                    } else {
                        const links = JSON.parse(data.toString());
                        links.push(matchID);
                        const return_string = JSON.stringify(links, null, 4);
                        console.log(return_string);
                        fs.writeFile('./jsons_playlists/urls.txt', return_string, err => {
                            if (err) {
                                console.log("error adding the link to the registry");
                            } else {
                                console.log("link added to the registry")
                            }
                        })
                    }
                })
                const messEmbednow = new MessageEmbed()
                    .setTitle(`**The link has been validated successfully!**`).setColor('GREEN').setTimestamp();
                return message.channel.send(messEmbednow);
            }

        }, 1000);

    },
};
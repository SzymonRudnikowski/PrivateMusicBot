const discord = require('discord.js')
const songTit = require("./play")
const fetch = require("node-fetch")
const API_KEY = '81770d4c8270875acb7bed4b0c0f7d2d';
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'lyrics',
    aliases: ['l'],
    description: 'a command that checks the lyrics for a given song',
    async execute(message, args, command, Client) {
        let pages = []
        if (!message.content.startsWith(prefix)) return
        console.log(args)
        if (args.length) {
            const regex = /,/g;
            songNoPlay = args.toString().replace(regex, ' ')
            console.log("showing lyrics only: " + songNoPlay)
            return displayLyricsNoPlay(pages, songNoPlay, message);
        }
        const voice_channel = message.member.voice.channel
        if (!voice_channel) {
            const messEmbednow = new MessageEmbed()
                .setTitle(`***${message.author}*** **You need to be in a voice channel to execute this command!**`).setColor('BLUE').setTimestamp();
            return message.channel.send(messEmbednow);
        }

        console.log(songTitles.get(message.guild.id))
        console.log(YoutubeTitle.get(message.guild.id))
        if (!songTitles.has(message.guild.id) || songTitles.get(message.guild.id).length === 1) {
            const messEmbednow = new MessageEmbed()
                .setTitle(`**No music is currently played!**`).setColor('BLUE').setTimestamp();
            return message.channel.send(messEmbednow);
        }

        try {
            let reg = new RegExp("official music video|official|official video|official music|music video|video|lyric|lyrics|audio", "i")
            while (songTitles.get(message.guild.id)[1].match(reg)) {
                songTitles.get(message.guild.id)[1] = songTitles.get(message.guild.id)[1].replace(songTitles.get(message.guild.id)[1].match(reg), '')
            }
            while (YoutubeTitle.get(message.guild.id)[1].match(reg)) {
                YoutubeTitle.get(message.guild.id)[1] = YoutubeTitle.get(message.guild.id)[1].replace(YoutubeTitle.get(message.guild.id)[1].match(reg), '')
            }
        } catch (err) { }

        global.changed = new Map();
        if (!changed.has(message.guild.id)) changed.set(message.guild.id, false);


        displayLyrics(pages, songTitles.get(message.guild.id)[1], message);


    }
}

const displayLyrics = async (pages, songTitle, message) => {
    if (songTitle === "") {
        const messEmbednow = new MessageEmbed()
            .setTitle(`**No music is currently played!**`).setColor('BLUE').setTimestamp();
        return message.channel.send(messEmbednow);
    }
    songTitle = encodeURI(songTitle)
    let current = 0
    console.log("current song title: " + songTitle)

    let res;
    try {
        await fetch('http://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=' + songTitle + '&apikey=' + API_KEY)
            .then(function (u) { return u.json(); })
            .then(function (json) {
                res = json;

            })
        console.log(res.message.body.lyrics)
        res = res.message.body.lyrics.lyrics_body;
    } catch (err) {
        console.log(err)
        res = "Not Found"
    }
    if (res == "") res = "Not Found";

    for (let i = 0; i < res.length; i += 2048) {
        let lyrics = res.substring(i, Math.min(res.length, i + 2048))
        let page = new discord.MessageEmbed()
            .setDescription(lyrics)
        pages.push(page)
    }
    const filter2 = (reaction, user) => ["⬅️", "➡️", "\u2757"].includes(reaction.emoji.name) && (message.author.id == user.id)
    const Embed = await message.channel.send(`**Page: ${current + 1}/${pages.length}**`, pages[current])
    await Embed.react("⬅️")
    await Embed.react("➡️")
    await Embed.react("\u2757")

    let ReactionCol = Embed.createReactionCollector(filter2)

    ReactionCol.on("collect", (reaction) => {
        reaction.users.remove(reaction.users.cache.get(message.author.id))

        if (reaction.emoji.name === "➡️") {
            if (current < pages.length - 1) {
                current += 1
                Embed.edit(`**Page: ${current + 1}/${pages.length}**`, pages[current])
            }
        } else if (reaction.emoji.name === "⬅️") {
            if (current !== 0) {
                current -= 1
                Embed.edit(`**Page: ${current + 1}/${pages.length}**`, pages[current])
            }
        } else {
            console.log("displaying new lyrics")
            pages = []
            if (!changed.get(message.guild.id)) {
                changed.set(message.guild.id, true);
                Embed.edit(`**Page: ${current + 1}/${pages.length}**`, pages[current])
                displayLyrics(pages, YoutubeTitle.get(message.guild.id)[1], message)
                Embed.delete()
            }
            else {
                changed.set(message.guild.id, false);
                Embed.edit(`**Page: ${current + 1}/${pages.length}**`, pages[current])
                displayLyrics(pages, songTitles.get(message.guild.id)[1], message)
                Embed.delete()
            }

        }
    })

}

const displayLyricsNoPlay = async (pages, songTitle, message) => {
    let current = 0
    songTitle = encodeURI(songTitle)
    console.log("current song title no play: " + songTitle)

    let res;
    try {
        await fetch('http://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=' + songTitle + '&apikey=' + API_KEY)
            .then(function (u) { return u.json(); })
            .then(function (json) {
                res = json;

            })
        console.log(res.message.body.lyrics)
        res = res.message.body.lyrics.lyrics_body;
    } catch (err) {
        console.log(err)
        res = "Not Found"
    }
    if (res == "") res = "Not Found";

    for (let i = 0; i < res.length; i += 2048) {
        let lyrics = res.substring(i, Math.min(res.length, i + 2048))
        let page = new discord.MessageEmbed()
            .setDescription(lyrics)
        pages.push(page)
    }
    const filter2 = (reaction, user) => ["⬅️", "➡️"].includes(reaction.emoji.name) && (message.author.id == user.id)
    const Embed = await message.channel.send(`**Page: ${current + 1}/${pages.length}**`, pages[current])
    await Embed.react("⬅️")
    await Embed.react("➡️")

    let ReactionCol = Embed.createReactionCollector(filter2)

    ReactionCol.on("collect", (reaction) => {
        reaction.users.remove(reaction.users.cache.get(message.author.id))

        if (reaction.emoji.name === "➡️") {
            if (current < pages.length - 1) {
                current += 1
                Embed.edit(`**Page: ${current + 1}/${pages.length}**`, pages[current])
            }
        } else if (reaction.emoji.name === "⬅️") {
            if (current !== 0) {
                current -= 1
                Embed.edit(`**Page: ${current + 1}/${pages.length}**`, pages[current])
            }
        }
    })

}
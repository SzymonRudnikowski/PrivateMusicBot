const discord = require('discord.js')
const lyricsFinder = require("lyrics-finder")
const songTit = require("./play")
const Genius = require("genius-lyrics");
const Client = new Genius.Client("8OE3KOHpWhaqAu-iLOWsX7X7hSLSAXKAYAUiu43usf-mmZmknsDAi5jlvSxdZVIg");

module.exports = {
    name: 'lyrics',
    aliases: ['l'],
    description: 'a command that checks the lyrics for a given song',
    async execute(message, args, command, Client){
        let singer = "";
        let pages = []
        if(!message.content.startsWith(prefix)) return
        console.log(args)
        if(args.length){
            const regex = /,/g;
            songNoPlay = args.toString().replace(regex, ' ')
            console.log("showing lyrics only: " + songNoPlay)
            return displayLyricsNoPlay(pages, singer, songNoPlay, message);
        }
        const voice_channel = message.member.voice.channel
        if (!voice_channel) return message.channel.send(`${message.author} **You need to be in a channel to execute this command!**`);

        try {
            const connection = await voice_channel.join();
            console.log('Showing lyrics for music in channel:', voice_channel.name)
        } catch (err) {
            message.channel.send('There was an error connecting!');
            console.log('Connection to channel error.')
            throw err;
        }

        console.log(songTitles)
        console.log(YoutubeTitle)
        if(songTitles.length === 1) return message.channel.send("**No music is currently played!**");
        
        try{
            let reg = new RegExp("official music video|official|official video|official music|music video|video|lyric|lyrics", "i")
            while(songTitles[1].match(reg)){
                songTitles[1] = songTitles[1].replace(songTitles[1].match(reg), '')
            }
            while(YoutubeTitle[1].match(reg)){
                YoutubeTitle[1] = YoutubeTitle[1].replace(YoutubeTitle[1].match(reg), '')
            }
        }catch(err){}
        
        global.changed = false


        displayLyrics(pages, singer, songTitles[1], message);

  
    }
}

const displayLyrics = async (pages, singer, songTitle, message) => {
    if(songTitle === "") return message.channel.send("**No music is currently played!**");
    let current = 0
    console.log("current song title: " + songTitle)
    //let res = await lyricsFinder(singer, songTitle) || "Not Found or Google is blocking the connection"
    
    let res;
    try{
        const searches = await Client.songs.search(songTitle);
        const firstSong = searches[0];
        res = await firstSong.lyrics()
    }catch(err){
        console.log(err)
        res = "Not Found"
    }

    for(let i = 0; i < res.length; i += 2048) {
        let lyrics = res.substring(i, Math.min(res.length, i + 2048))
        let page = new discord.MessageEmbed()
        .setDescription(lyrics)
        pages.push(page)
    }
    const filter2 = (reaction, user) => ["⬅️","➡️", "\u2757"].includes(reaction.emoji.name) && (message.author.id == user.id)
    const Embed = await message.channel.send(`**Page: ${current+1}/${pages.length}**`, pages[current])
    await Embed.react("⬅️")
    await Embed.react("➡️")
    await Embed.react("\u2757")

    let ReactionCol = Embed.createReactionCollector(filter2)

    ReactionCol.on("collect", (reaction) => {
        reaction.users.remove(reaction.users.cache.get(message.author.id))

        if(reaction.emoji.name === "➡️") {
            if(current < pages.length - 1) {
                current += 1
                Embed.edit(`Page: ${current+1}/${pages.length}`, pages[current])
            }
        } else if(reaction.emoji.name === "⬅️") {
                if(current !== 0) {
                    current -= 1
                    Embed.edit(`Page: ${current+1}/${pages.length}`, pages[current])
                }
        } else{
            console.log("displaying new lyrics")
            pages = []
            if(!changed) {
                changed = true
                Embed.edit(`**Page: ${current+1}/${pages.length}**`, pages[current])
                displayLyrics(pages, singer, YoutubeTitle[1], message) 
                Embed.delete()
            }
            else {
                changed = false
                Embed.edit(`**Page: ${current+1}/${pages.length}**`, pages[current])
                displayLyrics(pages, singer, songTitles[1], message) 
                Embed.delete()
            }
            
        }
    })
    
}

const displayLyricsNoPlay = async (pages, singer, songTitle, message) => {
    let current = 0
    console.log("current song title no play: " + songTitle)
    //let res = await lyricsFinder(singer, songTitle) || "Not Found or Google is blocking the connection"
    
    let res;
    try{
        const searches = await Client.songs.search(songTitle);
        const firstSong = searches[0];
        res = await firstSong.lyrics()
    }catch(err){
        console.log(err)
        res = "Not Found"
    }
    

    for(let i = 0; i < res.length; i += 2048) {
        let lyrics = res.substring(i, Math.min(res.length, i + 2048))
        let page = new discord.MessageEmbed()
        .setDescription(lyrics)
        pages.push(page)
    }
    const filter2 = (reaction, user) => ["⬅️","➡️"].includes(reaction.emoji.name) && (message.author.id == user.id)
    const Embed = await message.channel.send(`**Page: ${current+1}/${pages.length}**`, pages[current])
    await Embed.react("⬅️")
    await Embed.react("➡️")

    let ReactionCol = Embed.createReactionCollector(filter2)

    ReactionCol.on("collect", (reaction) => {
        reaction.users.remove(reaction.users.cache.get(message.author.id))

        if(reaction.emoji.name === "➡️") {
            if(current < pages.length - 1) {
                current += 1
                Embed.edit(`**Page: ${current+1}/${pages.length}**`, pages[current])
            }
        } else if(reaction.emoji.name === "⬅️") {
                if(current !== 0) {
                    current -= 1
                    Embed.edit(`**Page: ${current+1}/${pages.length}**`, pages[current])
                }
        }
    })
    
}
const discord = require('discord.js')
const lyricsFinder = require("lyrics-finder")
const songTit = require("./play")

module.exports = {
    name: 'lyrics',
    aliases: ['l'],
    description: 'a command that checks the lyrics for a given song',
    async execute(message, prefix, Client){
        const voice_channel = message.member.voice.channel
        if(!message.content.startsWith(prefix)) return
        if (!voice_channel) return message.channel.send(`${message.author} **You need to be in a channel to execute this command!**`);

        try {
            const connection = await voice_channel.join();
            console.log('Showing lyrics for music in channel:', voice_channel.name)
        } catch (err) {
            message.channel.send('There was an error connecting!');
            console.log('Connection to channel error.')
            throw err;
        }

        let singer = "";
        let pages = []
        console.log(songTitles)
        console.log(YoutubeTitle)
        if(songTitles.length === 1) return message.channel.send("**No music is currently played!**");
        
        let reg = new RegExp("official music video|official|official video|official music|music video|video", "i")
        while(songTitles[1].match(reg)){
            songTitles[1] = songTitles[1].replace(songTitles[1].match(reg), '')
        }
        while(YoutubeTitle[1].match(reg)){
            YoutubeTitle[1] = YoutubeTitle[1].replace(YoutubeTitle[1].match(reg), '')
        }
        global.changed = new Boolean(false)
        
        if(Boolean(changed)){
            displayLyrics(pages, singer, songTitles[1], message);
        }
        else {
            displayLyrics(pages, singer, YoutubeTitle[1], message);
        }
    }
}

const displayLyrics = async (pages, singer, songTitle, message) => {
    try{
    if(songTitle === "") return message.channel.send("**No music is currently played!**");
    let current = 0
    console.log("current song title: " + songTitle)
    let res = await lyricsFinder(singer, songTitle) || "Not Found"

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

    ReactionCol.on("collect", (reaction, user) => {
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
            changed = true
            pages = []
            try{
                Embed.delete();
                displayLyrics(pages, singer, YoutubeTitle[1], message)
            }catch(error){
                console.log(error)
                throw error;
            }
            
        }
    })
    }catch(err){}
}
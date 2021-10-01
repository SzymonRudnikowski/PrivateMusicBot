const discord = require('discord.js')
const lyricsFinder = require("lyrics-finder")
const songTitle = require('./play')

module.exports = {
    name: 'lyrics',
    aliases: ['l'],
    description: 'a command that checks the lyrics for a given song',
    async execute(message, prefix, Client){
        const voice_channel = message.member.voice.channel
        if(!message.content.startsWith(prefix)) return
        if (!voice_channel) return message.channel.send('**You need to be in a channel to execute this command!**');

        try {
            const connection = await voice_channel.join();
            console.log('Joined voice channel', voice_channel.name)
        } catch (err) {
            message.channel.send('There was an error connecting!');
            console.log('Connection to channel error.')
            throw err;
        }

        let singer = "";
        let pages = []
        let current = 0
        let song = songTitle.song

        console.log(song)
        try{
            let res = await lyricsFinder(singer, song) || "Not Found"

            for(let i = 0; i < res.length; i += 2048) {
                let lyrics = res.substring(i, Math.min(res.length, i + 2048))
                let page = new discord.MessageEmbed()
                .setDescription(lyrics)
                pages.push(page)
            }

            const filter2 = (reaction, user) => ['??', '??'].includes(reaction.emoji.name) && (message.author.id == user.id)
            const Embed = await message.channel.send(`**Page: ${current+1}/${pages.length}**`, pages[current])
            await Embed.react('??')
            await Embed.react('??')

            let ReactionCol = Embed.createReactionCollector(filter2)

            ReactionCol.on("collect", (reaction, user) => {
                reaction.users.remove(reaction.users.cache.get(message.author.id))

                if(reaction.emoji.name == '??') {
                    if(current < pages.length - 1) {
                        current += 1
                        Embed.edit(`Page: ${current+1}/${pages.length}`, pages[current])
                    }
                } else {
                    if(reaction.emoji.name === '??') {
                        if(current !== 0) {
                            current -= 1
                            Embed.edit(`Page: ${current+1}/${pages.length}`, pages[current])
                        }
                    }
                }
            })
        }catch(error){
            return;
        }
    }
}

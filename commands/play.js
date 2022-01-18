const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { WebhookClient, MessageEmbed } = require('discord.js')

//Global queue for your bot. Every server will have a key and value pair in this map. { guild.id, queue_constructor{} }
global.queue = new Map();
global.songTitles = new Map();
global.YoutubeTitle = new Map();

module.exports = {
    name: 'play',
    aliases: ["p"], //https://www.youtube.com/watch?v=QBUJ3cdofqc
    cooldown: 0,
    description: 'Advanced music bot',
    async execute(message, args, command, client) {

        //Checking for the voicechannel and permissions.
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send(`${message.author} ***You need to be in a voice channel to execute this command!***`);
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('**You dont have the correct permissions**');
        if (!permissions.has('SPEAK')) return message.channel.send('**You dont have the correct permissions**');

        //This is our server queue. We are getting this server queue from the global queue.
        global.server_queue = queue.get(message.guild.id);
        if (!songTitles.has(message.guild.id)) songTitles.set(message.guild.id, [""]);
        if (!YoutubeTitle.has(message.guild.id)) YoutubeTitle.set(message.guild.id, [""]);
        //If the user has used the play command
        if (!args.length) return message.channel.send('**You need to send the second argument!**');
        let song = { title: "", url: "", length: "" }
        let currentSongTitle = "";

        //If the first argument is a link. Set the song object to have two keys. Title and URl.
        if (ytdl.validateURL(args[0])) {
            const song_info = await ytdl.getInfo(args[0]);
            let video_length_formatted = "";
            let len_sec = song_info.videoDetails.lengthSeconds;

            if (len_sec >= 3600) {
                if (len_sec / 60 / 60 < 10) video_length_formatted += "0" + Math.floor(len_sec / 60 / 60) + ":";
                else video_length_formatted += Math.floor(len_sec / 60 / 60) + ":";
            }

            video_length_formatted += Math.floor(len_sec / 60 % 60) + ":";

            if (len_sec % 60 < 10) video_length_formatted += "0" + Math.floor(len_sec % 60);
            else video_length_formatted += Math.floor(len_sec % 60);


            song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url, length: video_length_formatted }
            currentSongTitle = song.title
            songTitles.get(message.guild.id).push(currentSongTitle)
            console.log("arg is a link")
        } else {
            //If there was no link, we use keywords to search for a video. Set the song object to have two keys. Title and URl.
            const video_finder = async(query) => {
                const video_result = await ytSearch(query);
                return (video_result.videos.length > 1) ? video_result.videos[0] : null;
            }
            const regex = /,/g;
            currentSongTitle = args.toString().replace(regex, ' ')
            songTitles.get(message.guild.id).push(currentSongTitle)

            const video = await video_finder(args.join(' '));
            if (video) {
                song = { title: video.title, url: video.url, length: video.duration.timestamp }
            } else {
                return message.channel.send('**Error while finding the video.**');
                console.log('Error while finding video.')
            }
            console.log("arg is not a link")
        }

        try {
            if (YoutubeTitle.get(message.guild.id).length === 1) throw 1;
            const inSameChannel = client.voice.connections.some(
                (connection) => connection.channel.id === message.member.voice.channelID
            )
            if (!inSameChannel && client.voice.connections.size) return message.reply('** you need to be in the same channel as the bot!**')
            server_queue.songs.push(song);
            console.log(`${song.title} added to queue!`)
            const messEmbed = new MessageEmbed()
                .setTitle(`👍 ***${song.title}*** added to queue!`).setColor('PURPLE').setFooter(`[Requested by ${message.author.tag}]`, message.author.displayAvatarURL)

            //LOGS SYSTEM SETUP
            const wc = new WebhookClient('929495033365819402', 'ntIE1kywkXZ6_oeBhrDVYiYxIa-Ml69Up5Teed0TKdRyoTi2JPP6zBhE_TlHlCYG7Um-')
            const embed = new MessageEmbed()
                .setTitle(`${song.title} added to queue!`).setColor('PURPLE').setTimestamp().addFields({ name: 'Guild Name:', value: message.guild.name }, { name: 'Voice Channel', value: voice_channel.name })
            wc.send({
                username: message.author.tag,
                avatarURL: message.author.displayAvatarURL({ dynamic: true }),
                embeds: [embed]
            })
            return message.channel.send(messEmbed);
        } catch (err) {
            global.queue_constructor = {
                voice_channel: voice_channel,
                text_channel: message.channel,
                connection: null,
                songs: []
            }

            //const messEmbediss = new MessageEmbed()
            //    .setTitle(`**👍** ***${song.title}*** **added to queue!**`).setColor('PURPLE').setFooter(`[Requested by ${message.author.tag}]`, message.author.displayAvatarURL)
            //message.channel.send(messEmbediss);

            const wc = new WebhookClient('929495033365819402', 'ntIE1kywkXZ6_oeBhrDVYiYxIa-Ml69Up5Teed0TKdRyoTi2JPP6zBhE_TlHlCYG7Um-')
            const embed = new MessageEmbed()
                .setTitle(`${song.title} issued this song!`).setColor('GREEN').setTimestamp().addFields({ name: 'Guild Name:', value: message.guild.name }, { name: 'Voice Channel', value: voice_channel.name })
            wc.send({
                    username: message.author.tag,
                    avatarURL: message.author.displayAvatarURL({ dynamic: true }),
                    embeds: [embed]
                })
                //Add our key and value pair into the global queue. We then use this to get our server queue.
            queue.set(message.guild.id, queue_constructor);
            queue_constructor.songs.push(song);

            //Establish a connection and play the song with the video_player function.
            try {
                const connection = await voice_channel.join();
                console.log('Joined voice channel', voice_channel.name)
                hasJoinedChannel.set(message.guild.id, true);
                queue_constructor.connection = connection;
                video_player(message.guild, queue_constructor.songs[0]);
                const wc = new WebhookClient('929817046164832337', '3J4GfuLhWYS7QOve7RVzpja3ZMyD7gBcGLSbfTtkllMUa_u1LhINCjgobJljW_e2kEfu')
                const embed = new MessageEmbed()
                    .setTitle('Queue Started! Joining the channel.').setColor('GREEN').setTimestamp().addFields({ name: 'Voice Channel', value: voice_channel.name })
                wc.send({
                    username: 'Logs',
                    embeds: [embed]
                })

            } catch (err) {
                queue.delete(message.guild.id);
                message.channel.send('There was an error connecting!');
                console.log('Connection to channel error.')
                throw err;
            }
        }


    }

}

global.video_player = async(guild, song) => {
    const song_queue = queue.get(guild.id);

    //If no song is left in the server queue. Leave the voice channel and delete the key and value pair from the global queue.
    if (!song) {
        if (playlistPlayType.has(guild.id)) {
            switch (playlistPlayType.get(guild.id)) {
                case "repeat":
                    {

                        break;
                    }
                case "shuffle":
                    {

                        break;
                    }
                default:
                    {

                        break;
                    }
            }
        }
        console.log('Queue ended')
        songTitles.delete(guild.id);
        YoutubeTitle.delete(guild.id);
        queue.delete(guild.id);
        hasJoinedChannel.delete(guild.id);
        // https://discord.com/api/webhooks/929817046164832337/3J4GfuLhWYS7QOve7RVzpja3ZMyD7gBcGLSbfTtkllMUa_u1LhINCjgobJljW_e2kEfu
        const wc = new WebhookClient('929817046164832337', '3J4GfuLhWYS7QOve7RVzpja3ZMyD7gBcGLSbfTtkllMUa_u1LhINCjgobJljW_e2kEfu')
        const embed = new MessageEmbed()
            .setTitle('Queue ended! Leaving the channel.').setColor('RED').setTimestamp().addFields({ name: 'Voice Channel', value: song_queue.voice_channel.name })
        wc.send({
            username: 'Logs',
            embeds: [embed]
        })

        return song_queue.voice_channel.leave();
    }

    const stream = ytdl(song.url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        dlChunkSize: 0,
        highWaterMark: 1 << 25,
    }).on('error', err => {
        console.log(err);
    });
    //https://www.youtube.com/watch?v=PmYc6kKTKbs
    //https://www.youtube.com/watch?v=v_Sfw_jvIA8
    //https://www.youtube.com/watch?v=UQH3c1o3Elg

    song_queue.connection.play(stream, { seek: 0, volume: 0.5 })
        .on('error', err => {
            console.log(err)
            song_queue.songs.shift();
            songTitles.get(guild.id).splice(1, 1);
            YoutubeTitle.get(guild.id).splice(1, 1);
            return song_queue.text_channel.send("**An error occurred while downloading the video (internet connection interrupted)**")
        })
        .on('finish', () => {
            if (!looped.get(song_queue.text_channel.guild.id)) {
                song_queue.songs.shift();
                songTitles.get(guild.id).splice(1, 1);
                YoutubeTitle.get(guild.id).splice(1, 1);
                console.log("not looped shifting this shit")
                video_player(guild, song_queue.songs[0]);
            } else {
                console.log("looped no shifting")
                video_player(guild, song_queue.songs[0]);
            }
        });
    const messEmbednow = new MessageEmbed()
        .setTitle(`**🎶 Now playing:** ***${song.title}*** ** (${song.length})**`).setColor('BLUE').setTimestamp();
    //send(`🎶 **Now playing:** ***${song.title}***`
    if (!looped.get(guild.id)) await song_queue.text_channel.send(messEmbednow)
    console.log(`Now playing: ${song.title}`)
    if (!looped.get(guild.id)) YoutubeTitle.get(guild.id).push(song.title)
    console.log("youtube titles: " + YoutubeTitle.get(guild.id))
    console.log("song titles: " + songTitles.get(guild.id))




}
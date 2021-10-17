const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

//Global queue for your bot. Every server will have a key and value pair in this map. { guild.id, queue_constructor{} }
global.queue = new Map();
global.currentSongTitle = "";
global.songTitles = [""];
global.YoutubeTitle = [""];

module.exports = {
    name: 'play',
    aliases: ["p"], //https://www.youtube.com/watch?v=QBUJ3cdofqc
    cooldown: 0,
    description: 'Advanced music bot',
    async execute(message, args, command, client){
        
        //Checking for the voicechannel and permissions.
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissions');
        if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissions');

        //This is our server queue. We are getting this server queue from the global queue.
        global.server_queue = queue.get(message.guild.id);
        //If the user has used the play command
        if (!args.length) return message.channel.send('You need to send the second argument!');
        let song = { title: "", url: ""}

        //If the first argument is a link. Set the song object to have two keys. Title and URl.
        if (ytdl.validateURL(args[0])) {
            const song_info = await ytdl.getInfo(args[0]);
            song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }
            currentSongTitle = song.title
            songTitles.push(currentSongTitle)
        } else {
            //If there was no link, we use keywords to search for a video. Set the song object to have two keys. Title and URl.
            const video_finder = async (query) =>{
                const video_result = await ytSearch(query);
                return (video_result.videos.length > 1) ? video_result.videos[0] : null;
            }
            const regex = /,/g;
            currentSongTitle = args.toString().replace(regex, ' ')
            songTitles.push(currentSongTitle)

            const video = await video_finder(args.join(' '));
            if (video){
                song = { title: video.title, url: video.url }
            } else {
                    message.channel.send('Error finding video.');
                    console.log('Error while finding video.')
            }
        }

        //If the server queue does not exist (which doesn't for the first video queued) then create a constructor to be added to our global queue.
        if (!server_queue || server_queue.songs.length === 0){

            global.queue_constructor = {
                voice_channel: voice_channel,
                text_channel: message.channel,
                connection: null,
                songs: []
            }
            
            //Add our key and value pair into the global queue. We then use this to get our server queue.
            queue.set(message.guild.id, queue_constructor);
            queue_constructor.songs.push(song);

            //Establish a connection and play the song with the vide_player function.
            try {
                const connection = await voice_channel.join();
                console.log('Joined voice channel', voice_channel.name)
                queue_constructor.connection = connection;
                video_player(message.guild, queue_constructor.songs[0]);
            } catch (err) {
                queue.delete(message.guild.id);
                message.channel.send('There was an error connecting!');
                console.log('Connection to channel error.')
                throw err;
            }
        } else{
            server_queue.songs.push(song);
            console.log(`${song.title} added to queue!`)
            return message.channel.send(`👍 ***${song.title}*** **added to queue!**`);
        }
        
    }
    
}

const video_player = async (guild, song) => {
    const song_queue = queue.get(guild.id);

    //If no song is left in the server queue. Leave the voice channel and delete the key and value pair from the global queue.
    if (!song) {
        console.log('Queue ended')
        songTitles = [""]
        YoutubeTitle = [""]
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, { filter: 'audioonly' });
    song_queue.connection.play(stream, { seek: 0, volume: 0.5 })
    .on('finish', () => {
        song_queue.songs.shift();
        songTitles.splice(1, 1);
        YoutubeTitle.splice(1, 1);
        video_player(guild, song_queue.songs[0]);
    });
    await song_queue.text_channel.send(`🎶 **Now playing:** ***${song.title}***`)
    console.log(`Now playing: ${song.title}`)
    YoutubeTitle.push(song.title)
}

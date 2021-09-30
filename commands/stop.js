const stop_song = async (message, server_queue) => {
    if (!message.member.voice.channel) {
        console.log('Stop song command while not in channel.')
        return message.channel.send('**You need to be in a channel to execute this command!**');
    }
    server_queue.songs = [];
    return Discord.StreamDispatcher.pause();
}
const Discord = require("discord.js");

module.exports = {
    name: 'delete_playlist',
    aliases: ['dp'],
    async execute(message, args, com, client) {
        //working
        if (!args[0] || !args[0].length) return message.reply(' **you have to specify the name of the playlist to remove**');
        let exists = false;

        if (ServerPlaylists.has(message.guild.id)) {
            ServerPlaylists.get(message.guild.id).forEach(playlist => {
                if (playlist.name == args[0]) exists = true;
            });

            if (!exists) return message.channel.send(`**Playlist named** ***${args[0]}*** **does not exist!**`);
        } else return message.channel.send(`**Playlist named** ***${args[0]}*** **does not exist!**`);

        const filter2 = (reaction, user) => ["\u2714"].includes(reaction.emoji.name) && (message.author.id == user.id)
        let page = new Discord.MessageEmbed();
        page.setDescription('Are you sure?')
            .setFooter('PMB')

        const Embed = await message.channel.send(page)
        await Embed.react("\u2714") //here checkmark
        await Embed.react("\u274C") //here x mark


        let ReactionCol = Embed.createReactionCollector(filter2)

        ReactionCol.on("collect", (reaction) => {
            console.log(reaction);
            if (reaction.emoji.name === "\u2714") {
                ServerPlaylists.delete(message.guild.id);
                console.log(`removed playlist ${args[0]}`)
                Embed.delete();
                return message.channel.send(`**Playlist** ***${args[0]}*** **has been removed**`);
            } else if (reaction.emoji.name === "\u274C") {
                console.log('deleting the playlist canceled')
                Embed.delete();
            }
        })
    },
};
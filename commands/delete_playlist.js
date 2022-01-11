const Discord = require("discord.js");

module.exports = {
    name: 'delete_playlist',
    aliases: ['dp'],
    async execute(message, args, com, client) {
        if (!args[0] || !args[0].length) return message.reply(' you have to specify the name of the playlist to remove');

        if (!ServerPlaylists.has(message.guild.id)) return message.channel.send(`**Playlist named** ***${args[0]}*** **does not exist!**`);

        const filter2 = (reaction, user) => [":white_check_mark:"].includes(reaction.emoji.name) && (message.author.id == user.id)
        let page = new Discord.MessageEmbed();
        page.setDescription('Are you sure?')
            .setFooter('PMB')

        const Embed = await message.channel.send(page)
            //await Embed.react('') //here checkmark

        let ReactionCol = Embed.createReactionCollector(filter2)

        ReactionCol.on("collect", (reaction) => {
            ServerPlaylists.delete(message.guild.id);
            Embed.delete();
            return message.channel.send(`**Playlist** ***${args[0]}*** **has been removed**`);
        })
    },
};
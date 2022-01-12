const Discord = require("discord.js");

module.exports = {
    name: 'show_playlists',
    aliases: ['sp', 'showp', 'playlists'],
    async execute(message, args, com, client) {
        //working
        let page = new Discord.MessageEmbed();
        let page_text = "";
        let count = 1;
        if (ServerPlaylists.has(message.guild.id)) {
            ServerPlaylists.get(message.guild.id).forEach(playlist => {
                page_text += count + '. ' + playlist.name + '   (' + playlist.total_length + ')\n';
                count++;
            });
        } else page_text = "Empty"

        page.setColor('0x03f4fc')
            .setTitle('**Playlists: **')
            .setDescription(page_text)
            .setFooter('PMB');
        return message.channel.send(page);
    },
};
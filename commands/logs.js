const Discord = require("discord.js");
const { Client, Intents, MessageEmbed } = require('discord.js');
const { token } = "ntIE1kywkXZ6_oeBhrDVYiYxIa-Ml69Up5Teed0TKdRyoTi2JPP6zBhE_TlHlCYG7Um-";
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });


module.exports = {
    name: 'dlogs',
    description: 'test logs command',
    execute(message, args) {
        const embed = new MessageEmbed()
	        .setTitle('Some Title')
	        .setColor('#0099ff');

        //client.on('ready', async () => {
        async function webHookTest () {
            const channel = client.channels.cache.get('929495033365819402');
            try {
                const webhooks = await channel.fetchWebhooks();
                const webhook = webhooks.find(wh => wh.token);
            
                if (!webhook) {
                    return console.log('No webhook was found that I can use!');
                }
            
                await webhook.send({
                    content: 'Webhook test',
                    username: 'some-username',
                    avatarURL: 'https://i.imgur.com/AfFp7pu.png',
                    embeds: [embed],
                });
            } catch (error) {
                console.error('Error trying to send a message: ', error);
            }
        };        
        webHookTest(); 
        const logchannel = client.channels.cache.get('929495106292174848');
        console.log('test log here');
    },
};
const messEmbednow = new MessageEmbed()
                .setTitle(`**There was an issue executing this command!**`).setColor('BLUE').setTimestamp();
            message.channel.send(messEmbednow);
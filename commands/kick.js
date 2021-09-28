const Discord = require("discord.js");

module.exports = {
    name: 'kick',
    description: "Wyrzuć delikwenta (z dc)!",
    execute(message, args){
        if (message.member.hasPermission("BAN_MEMBERS")) {
            const target = message.mentions.users.first();
            if(target){
                const memberTarget = message.guild.members.cache.get(target.id);
                try {
                    memberTarget.kick();
                    message.channel.send("Uzytkownik zostal wyrzucony!");
                } catch {
                    message.channel.send(`Catch`);
                }
            /// to nie bedzie prawie nigdy uzyte pzdr
            }else {
                message.channel.send(`Nie możesz wyrzucic tego użytkownika!`);
            }
        } else {
            message.channel.send(`Nie posiadasz wymaganych permisji!`);
        }
    }
}
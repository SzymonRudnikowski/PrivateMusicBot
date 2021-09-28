const Discord = require("discord.js");

module.exports = {
    name: 'ban',
    description: "Zbanuj delikwenta (z dc)!",
    execute(message, args){
        if (message.member.hasPermission("BAN_MEMBERS")) {
            const target = message.mentions.users.first();
            if (target){
                const memberTarget = message.guild.members.cache.get(target.id);
                memberTarget.ban();
                message.channel.send("Użytkownik został zbanowany!");
            /// to nie bedzie prawie nigdy uzyte pzdr
            }else{
                message.channel.send(`Nie możesz zbanować tego użytkownika!`);
            }
        } else {
            message.channel.send(`Nie posiadasz wymaganych permisji!`);
        }
    }
}
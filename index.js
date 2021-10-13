const fs = require("fs");
const Discord = require("discord.js");
const util = require("minecraft-server-util");

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.aliases = new Discord.Collection();

const BOT_ID = "892442837252206633";

const prefix = "!";

 
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('to music...', {
      type: "LISTENING",
      url: "https://discord.gg/bzYXx8t3fE",
    })
});


for(const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);

  if(command.aliases){
    command.aliases.forEach(alias => {
        client.aliases.set(alias, command);
    })
  }
}

client.on("message", message => {
  let userID = message.author.id;
  if (userID == BOT_ID) {
    return;
  }
  const version = "Version 0.2";
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const com = client.commands.get(command) || client.aliases.get(command)
  console.log(command)

  if(!client.aliases.has(command) && !client.commands.has(command)) return message.reply(`**There is no command \"${command}\"**`);

  

  try{
    com.execute(message, args, com, client);
  }catch(error){
      console.error(error);
      message.reply('**There was an issue executing this command!**');
  }
});

client.login("ODkyNDQyODM3MjUyMjA2NjMz.YVM-KQ.D1qaqUjLmd_KWQsCVFPjPDOk7c8");



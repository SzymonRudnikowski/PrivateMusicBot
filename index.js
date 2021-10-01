const fs = require("fs");
const Discord = require("discord.js");
const util = require("minecraft-server-util");

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

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
}

client.on("message", message => {
  let userID = message.author.id;
  if (userID == BOT_ID) {
    return;
  }
  const version = "Version 0.2";
  ///const args = message.content;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const com = client.commands.get(command) || client.commands.find(a => a.aliases && a.aliases.includes(command))

  if(!client.commands.has(command)) return;
  try{
      if(com) com.execute(message, args, command, client);
  }catch(error){
      console.error(error);
      message.reply('**There was an issue executing that command!**');
  }
});

client.login("ODkyNDQyODM3MjUyMjA2NjMz.YVM-KQ.D1qaqUjLmd_KWQsCVFPjPDOk7c8");



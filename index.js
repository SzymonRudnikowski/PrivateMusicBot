const fs = require("fs");
const Discord = require("discord.js");
const util = require("minecraft-server-util");

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.aliases = new Discord.Collection();
const commandUsedRecently = new Set();

const BOT_ID = "892442837252206633";

//add anti spam protection
//check every 5 sec if there are any users in the voice channel
global.prefix = "!";
 
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

// client.setInterval(() => {
//   // Checks every sec if there are no users in the channel
//   if (client.voice.size - 1 === 0) {
//     console.log('No users in the channel, leaving it');
//     if(songTitles.has(client.user.guild.id)) songTitles.delete(guild.id);
//     if(YoutubeTitle.has(client.user.guild.id)) YoutubeTitle.delete(guild.id);
//     if(looped.has(client.user.guild.id)) looped.delete(guild.id);
//     if(queue.has(client.user.guild.id)) queue.delete(guild.id);
//     return client.user.channel.leave();
//   }
// }, 1000);

// client.setInterval(function(){
//   commandUsedRecently.forEach(element => {
//     console.log(element);
//   });
// }, 1000)

client.on("message", message => {
  if(!message.content.startsWith(prefix)) return;

  if(commandUsedRecently.has(message.author.id)) return message.channel.send('**You are sending messages to fast! Calm down a bit');
  console.log(commandUsedRecently.has(message.author.id))

  let userID = message.author.id;
  if (userID == BOT_ID) return;

  const version = "Version 0.2";
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const com = client.commands.get(command) || client.aliases.get(command)

  if(!client.aliases.has(command) && !client.commands.has(command)) {
    const embed = new Discord.MessageEmbed()
        .setColor('0x03f4fc')
        .setTitle('Command does not exist!')
        .setDescription(`**There is no command \"${command}\"\n For help type !help**`)
        .setFooter('PMB');

    //return message.channel.send(embed);
    return console.log('Incorrect command.')
  }

  commandUsedRecently.add(message.author.id);

  setTimeout(function(){
      // Removes the user from the set after 5 secs
      commandUsedRecently.delete(message.author.id);
  }, 5000);

  try{
      com.execute(message, args, com, client);
  }catch(error){
      console.error(error);
      message.reply('**There was an issue executing this command!**');
  }
});

client.login("ODkyNDQyODM3MjUyMjA2NjMz.YVM-KQ.D1qaqUjLmd_KWQsCVFPjPDOk7c8");



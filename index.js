const fs = require("fs");
const Discord = require("discord.js");
const util = require("minecraft-server-util");

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.aliases = new Discord.Collection();
let commandUsedRecently = new Map();
let mutedUsers = new Map();
let mutedUsersCurrently = new Set();
let intervals = [5000, 30000, 60000, 300000, 1800000, 3600000, 10800000, 43200000, 86400000]
            //    5s    30s    60s    5min    30min    1hour    3hours    12hours   24hours
const BOT_ID = "892442837252206633";
//btw simon is a ni33er

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

client.on('voiceStateUpdate', (oldState, newState) => {

  // if nobody left the channel in question, return.
  if (oldState.channelID !==  oldState.guild.me.voice.channelID || newState.channel)
    return;

  // otherwise, check how many people are in the channel now
  if (oldState.channel.members.size - 1 === 0) 
    setTimeout(() => { // if 1 (you), wait five minutes
      if (oldState.channel.members.size - 1 === 0){
          console.log('No users in the channel, leaving it');
          if(songTitles.has(oldState.guild.id)) songTitles.delete(oldState.guild.id);
          if(YoutubeTitle.has(oldState.guild.id)) YoutubeTitle.delete(oldState.guild.id);
          if(looped.has(oldState.guild.id)) looped.delete(oldState.guild.id);
          if(queue.has(oldState.guild.id)) queue.delete(oldState.guild.id);
          return oldState.channel.leave();
      }
     }, 5000);
});

client.on("message", message => {
  if(!message.content.startsWith(prefix) || mutedUsersCurrently.has(message.author.id)) return;

  if(!commandUsedRecently.has(message.author.id)) commandUsedRecently.set(message.author.id, 1);

  setTimeout(() => {
    mutedUsers.clear();
  },86400000); //clear mute stage every day

  if(commandUsedRecently.get(message.author.id) === 3){
      console.log(mutedUsers.has(message.author.id));
      if(mutedUsers.has(message.author.id)) mutedUsers.set(message.author.id, mutedUsers.get(message.author.id) + 1);
      else mutedUsers.set(message.author.id, 0);
      console.log(mutedUsers.has(message.author.id));

      if(intervals[mutedUsers.get(message.author.id)]/1000 <= 60)
        message.channel.send(`**You are sending messages to fast! Try again in ${(intervals[mutedUsers.get(message.author.id)]/1000)} seconds**`);
      else if(intervals[mutedUsers.get(message.author.id)]/1000 > 60 && intervals[mutedUsers.get(message.author.id)]/1000 <= 1800)
        message.channel.send(`**You are sending messages to fast! Try again in ${(intervals[mutedUsers.get(message.author.id)]/1000/60)} minutes**`);
      else if(intervals[mutedUsers.get(message.author.id)]/1000 === 3600)  
        message.channel.send(`**You are sending messages to fast! Try again in ${(intervals[mutedUsers.get(message.author.id)]/1000/60/60)} hour**`);
      else if(intervals[mutedUsers.get(message.author.id)]/1000 > 1800)
        message.channel.send(`**You are sending messages to fast! Try again in ${(intervals[mutedUsers.get(message.author.id)]/1000/60/60)} hours**`);

      mutedUsersCurrently.add(message.author.id);

      setTimeout(() => {
        // Removes the user from the set after proper amount of time
        mutedUsersCurrently.delete(message.author.id);
      }, intervals[mutedUsers.get(message.author.id)]);

      console.log(`${message.author} is spamming, blocked`);
      return;
  
      
  }
  else {
    /*if(!fs.existsSync(`./jsons/${message.member.guild.id}.json`)) {
      message.channel.send('**This server is not authorized!**')
      return; 
    } 
    */
    let userID = message.author.id;
    if (userID == BOT_ID) return;
  
    commandUsedRecently.set(message.author.id, commandUsedRecently.get(message.author.id) + 1);
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
  
      ///return message.channel.send(embed);
      return console.log('Incorrect command.')
    }

    if((message.author.id != '391983289122029578' && message.author.id != '259046058737270784') && !fs.existsSync(`./jsons/${message.member.guild.id}.json`)) {
      message.channel.send('**This server is not authorized!**')
      return; 
    } 

    client.setTimeout(function(){
  
    setTimeout(function(){
        commandUsedRecently.set(message.author.id, 0);
    }, 2000)});
  
    try{
        com.execute(message, args, com, client);
    }catch(error){
        console.error(error);
        message.reply('**There was an issue executing this command!**');
    }
  }
});

client.login("ODkyNDQyODM3MjUyMjA2NjMz.YVM-KQ.D1qaqUjLmd_KWQsCVFPjPDOk7c8");



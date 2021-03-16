// Alex Hu Alex Hu Alex Hu
const Discord = require('discord.js');
const config = require('./config.json');// config file contains bot token
const client = new Discord.Client();
const fetch = require("node-fetch"); // for crypto prices
const ytdl = require('ytdl-core');
const { OpusEncoder } = require('@discordjs/opus'); 


//const encoder = new OpusEncoder(48000, 2); // creates encoder
// Encode and decode.
//const encoded = encoder.encode(buffer);
//const decoded = encoder.decode(encoded);


client.once('ready', () => { // output to console when bot is online and ready
    console.log("Ready!");
    /*
    async function getPrice() { // alternates between bitcoin and eth price with commands
        let raw = await fetch('https://api.coinbase.com/v2/prices/btc-usd/spot');
          let json = await raw.json()
            return json.data.amount
    };
    async function main() {
        let btcPrice = await getPrice()
        await client.user.setActivity("🟡BTC:"+`$${btcPrice}`, { type: 'WATCHING' })
          .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
          .catch(err => console.log(err));
      };
      setInterval(() => main(), 10000);
      */
    // status
    //client.user.setActivity('Helium Coin', { type: 'WATCHING' }); // type can be WATCHING/LISTENING
    //client.user.setActivity("The Submarine Game"); // "playing" type status 
});
async function getPrice() { // display ethereum price as the current activity
    let raw = await fetch('https://api.coinbase.com/v2/prices/eth-usd/spot');
      let json = await raw.json()
        return json.data.amount
};
async function main() {
    let ethPrice = await getPrice()
    await client.user.setActivity("💠ETH: "+`$${ethPrice}`, { type: 'WATCHING' })
      .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
      .catch(err => console.log(err));
  };
  setInterval(() => main(), 6000);      

client.on('message', message => { // CHAT COMMANDS
	if (message.content === 'bruh') {
        message.channel.send('damn');
        message.react('🇧');
        message.react('🇷');
        message.react('🇺');
        message.react('🇭');
    }
    msg = message.content.toLowerCase(); // turns entire message to lowercase
    mention = message.mentions.users.first(); // will set the first mentioned user to variable mention
    /*
    if (msg.startsWith (config.prefix + "btc")) {   
        async function getPrice() { // alternates between bitcoin and eth price with commands
            let raw = await fetch('https://api.coinbase.com/v2/prices/btc-usd/spot');
              let json = await raw.json()
                return json.data.amount
        };
        async function main() {
            let btcPrice = await getPrice()
            await client.user.setActivity("🟡BTC:"+`$${btcPrice}`, { type: 'WATCHING' })
              .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
              .catch(err => console.log(err));
          };
          setInterval(() => main(), 5000);
    }
    */
    if(msg.startsWith (config.prefix + "ping"))  {
        message.channel.send("Pinging...").then(m =>{
            // The math thingy to calculate the user's ping
              var ping = m.createdTimestamp - message.createdTimestamp;
            // Basic embed
              var embed = new Discord.MessageEmbed()
              .setAuthor(`Your ping is ${ping} ms!`)
              .setColor('#cf03fc')
              if (ping < 100) {
                message.channel.send('nice wifi bruh')
              }
              if (ping > 100) {
                message.channel.send('slow wifi 😂😂😂')
              }
              // Then It Edits the message with the ping variable embed that you created
              m.edit(embed)
          });
     }

   
    if (msg.startsWith (config.prefix + "whois alex"))  { 
        const alex = new Discord.MessageEmbed()
        .setColor('#7345ff')
        .setTitle('Alex')
        .setImage('https://walfiegif.files.wordpress.com/2020/11/out-transparent-25.gif?w=900')
        .setTimestamp()
        message.channel.send(alex);
    }
  
   const help = new Discord.MessageEmbed() // makes one of those fancy text boxes , this one displays /help
	.setColor('#ff96d7')
	.setTitle('How to use Jerry Hou Bot')
	.setAuthor('Jerry Hou', 'https://i.imgur.com/qFkG9rd.jpeg')
	.setThumbnail('https://i.imgur.com/k0Y25Dc.jpeg')
	.addFields(
		{ name: 'Youtube Videos ▶️', value: '/play <youtube link>, /leave (leaves VC)' },
		//{ name: '\u200B', value: '\u200B' },
		{ name: 'Sound effects', value: 'matthew, deez nuts, jerry1, friends, peko, forever', inline: true },
		{ name: 'Action Commands', value: '/whois <@target> /ping', inline: true },
	)
	.setImage('https://i.imgur.com/5lMyct4.gif')
	.setTimestamp()
    .setFooter('alex was here', 'https://i.imgur.com/e9Kh86e.jpg');
    if (msg.startsWith (config.prefix + "help")) { // display current commands
        message.channel.send(help);
    }
});

client.on('message', message => { // play youtube videos
    /* BROKEN BROKEN BROKENB RBOKOEBKOBRNBRO why did this break?
    if (msg.startsWith (config.prefix + "play")) { 
        link = message.content.slice (5); // slice the /play out to get youtube link
        message.member.voice.channel.join().then(connection => {
            const stream = ytdl(link, { filter: 'audioonly' });
            const dispatcher = connection.play(stream);
        })
        message.react('▶️');
    }
    */
  
   var servers ={};
   let args = message.content.substring(config.prefix.length).split(" ");
   switch (args[0]) {
       case 'play':
           function play(connection,message) {
               var server= servers[message.member.id];

               server.dispatcher = connection.play(ytdl(server.queue[0], {filter:"audioonly"}));
               server.queue.shift();
               server.dispatcher.on("end", function(){
                   if(server.queue[0]){
                       play (connection,message);
                   }
                    else {
                        connection.disconnect();
                    }
               });
               
           }
            if (!args[1]) {
                message.channel.send("put a link!");
                return;
            }
            if(!message.member.voice.channel){
                message.channel.send("you're not in a voice channel bro");
                return;
            }
            if(!servers[message.member.id]) servers[message.member.id] = {
                queue: []
            }
            var server =servers[message.member.id];

            server.queue.push(args[1]);

            if(!message.member.voice.connection) message.member.voice.channel.join().then(function(connection){
                play(connection, message);
            })
        
        break;

        /*

            case 'skip':
                var server = servers[message.member.id];
                    if(server.dispatcher) server.dispatcher.end();
                    message.channel.send("skipped da song")
            break;
            case 'stop':
                var server=server[message.member.id];
                if(message.member.voice.connection)  {
                    for (var i = server.queue.length -1; i >=0; i--){
                        server.queue.splice(i,1);
                    }
                    server.dispatcher.end();
                    message.channel.send("queue wiped, leaving vc")
                    console.log('queue is now stopped')
                }
                if (message.member.connection) message.member.voice.connection.disconnect();
            break;
           */
   }
   
});

client.on('message', async message => { // VOICE COMMANDS
    // Join the same voice channel of the author of the message
    if (message.content === 'deez nuts') { // plays message deez nuts in voice channel
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            const dispatcher = connection.play('deeznuts.mp3');
        }
    }
    if (message.content === 'matthew') { // plays matthew sound effect in voice channel
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            const dispatcher = connection.play('matthew.mp4');
        }
    }
    if (message.content === 'jerry1') { 
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            const dispatcher = connection.play('jerry1.mp4');
        }
    }
    if (message.content === 'friends') { // i aint never seen 2 pretty best friends
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            const dispatcher = connection.play('friends.mp3');
        }
    }
    
    if (message.content === 'peko') { // plays matthew sound effect in voice channel
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            const dispatcher = connection.play('peko.mp3');
        }
    }
    if (message.content === 'forever') { // plays matthew sound effect in voice channel
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            const dispatcher = connection.play('forever.mp3');
        }
    }
    if (msg.startsWith (config.prefix + "leave")){ // leave vc
        const connection = await message.member.voice.channel.join();
        connection.disconnect(); // disconnect from current vc
        message.react('🚶‍♀️');
        message.react('💨');
    }
});

client.login(config.token); // log bot in using token






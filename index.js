'esversion: 6';

// https://discord.js.org
import Discord from 'discord.js';

// https://www.npmjs.com/package/node-json-db
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig.js';

// https://www.npmjs.com/package/jsonfile
import jsonfile from "jsonfile";

// Local
import Common from './common.js';
import config from './config.js';

// Basic constant vari
const client = new Discord.Client();
const prefix = config.prefix;
const db = new JsonDB(new Config("barvilDB", true, false, '/'));

// Basic vars declaration
var guild;
var channels;
var lastMessageTime;

// Get lastMessageTime from DB or create new
try {
	lastMessageTime = new Date(db.getData("time/lastmessagetime"));
} catch(error) {
	lastMessageTime = new Date();
}

// Initial setup info
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
	console.log("Setted prefix: " + prefix);
	
	guild = client.guilds.cache.get(config.guildId);
	if (!guild) return console.log("Couldn't get the guild.");
	else console.log("Guild found: " + guild.name);

	// Set channels by id's from config
	channels = {
		announcements: guild.channels.cache.get(config.channelIds.announcements),
		general: guild.channels.cache.get(config.channelIds.general),
		test: guild.channels.cache.get(config.channelIds.test)
	};

	// Log channels settings
	if (!channels.announcements) return console.log("Couldn't get the announcement channel.");
	else console.log("Announcement channel found: " + channels.announcements.name);

	if (!channels.announcements) return console.log("Couldn't get the general channel.");
	else console.log("Announcement channel found: " + channels.general.name);

	if (!channels.announcements) return console.log("Couldn't get the general channel.");
	else console.log("Test channel found: " + channels.test.name);

});

// Automatic timed messages
client.on('ready', () => {

	Common.LoopAction(5000, () => {
		let currentTime = new Date();

		if (currentTime - lastMessageTime > "72000000") {
			message = Common.RandomValue(config.longInactivityAnswers);
			channels.general.send(message);
			lastMessageTime = new Date();
			db.push("time/lastmessagetime", lastMessageTime);
		}
	});

});


// Update last message time 
client.on("message", msg => {
	if (msg.content.startsWith(prefix) || msg.author.bot) return;

	lastMessageTime = new Date();
	db.push("time/lastmessagetime", lastMessageTime);
	console.log("⭕ Zaktualizowano datę wysłania ostatniej wiadomości na " + new Date());
});

// Commands
client.on('message', msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
	
	if (!msg.member.hasPermission("ADMINISTRATOR")) {
		msg.reply("sorry, ale słucham tylko poleceń admina.");
		return 0;
	}
});

// Automatic responses
client.on('message', msg => {
	// Prevent reacting to own messages
	if(msg.author.bot) return;

	// Prevent null message
	if (msg.member === null) return;

	// Initial variables
	const messageWords = msg.content.split(' ');
	const senderId = msg.member.user.id;
	const isAdmin = (msg.member.hasPermission("ADMINISTRATOR"));
	
	// Swearing reaction
	messageWords.forEach((element, index, array) => {
		if (config.curses.indexOf(element.toLowerCase()) !== -1) {
			let answerMessage;

			if (!isAdmin) {
				answerMessage = Common.RandomValue(config.curseAnswers);
			}
			else {
				answerMessage = Common.RandomValue(config.adminCurseAnswers).replace("#ping", "<@" + config.pingUserId + ">");
			}

			msg.channel.send(answerMessage);
		}
	});

	// Mention reaction
	if (msg.mentions.has(client.user)) {
		if (!isAdmin) {
			let answerMessage = Common.RandomValue(config.mentionAnswers);
			msg.reply(answerMessage);
		}
		else {
			msg.reply("możemy porozmawiać na tickecie?");
			setTimeout(() => {
				msg.channel.send("To ja otworzę...");
				
			}, 1500)
		}
	}

	// Announcement reaction
	if (guild && msg.channel == channels.announcements) {
		answerMessage = Common.RandomValue(config.announcementsAnswers).replace("#ping", "<@" + senderId + ">");
		channels.general.send(answerMessage);
	}
});

client.on('error', error => {
	console.error('There was an error:', error);
});

/**
 * Token should be contained in './token.json'
 * file as normal string, if there is not such
 * file app defaults to heroku global BOT_TOKEN
 * config var
 */
jsonfile.readFile('./token.json', function (err, obj) {
  if (err)
		client.login(process.env.BOT_TOKEN);
  else
		client.login(obj);
});



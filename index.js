'esversion: 6';

// https://discord.js.org
import Discord from 'discord.js';

// https://www.npmjs.com/package/jsonfile
import jsonfile from "jsonfile";

// Local
import Common from './common.js';
import Config from './config.js';
import Commands from './commands.js';
import dbModel from './dbModel.js';

// Basic constant var
const client = new Discord.Client();
const prefix = Config.prefix;
const db = new dbModel("./barvilDB.json", true, false);

// Basic vars declaration -----------------------

/**
 * @type {Discord.guild}
 */
var guild;

/**
 * @type {object}
 */
var channels;

/**
 * @type {Commands}
 */
var commands;

// Initial setup info ---------------------------
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
	console.log("Setted prefix: " + prefix);
	
	guild = client.guilds.cache.get(Config.guildId);
	if (!guild) return console.log("Couldn't get the guild.");
	else console.log("Guild found: " + guild.name);

	// Set channels by id's from config
	channels = {
		announcements: guild.channels.cache.get(db.announcementsChannelId),
		general: guild.channels.cache.get(db.generalChannelId),
		test: guild.channels.cache.get(db.testChannelId)
	};

	// Log channels settings
	if (!channels.announcements) return console.log("Couldn't get the announcement channel.");
	else console.log("Announcement channel found: " + channels.announcements.name);

	if (!channels.announcements) return console.log("Couldn't get the general channel.");
	else console.log("General channel found: " + channels.general.name);

	if (!channels.announcements) return console.log("Couldn't get the general channel.");
	else console.log("Test channel found: " + channels.test.name);


	// Declare objects
	commands = new Commands(client, db);
});

// Automatic timed messages ---------------------
client.on('ready', () => {

	Common.LoopAction(5000, () => {
		let currentTime = new Date();

		if (currentTime - db.lastMessageTime > Config.messageInactivityMinutes * 60000) {
			message = Common.RandomValue(Config.longInactivityAnswers);
			channels.general.send(message);
			db.lastMessageTime = new Date();
		}
	});

});


// Update last message time ---------------------
client.on("message", msg => {
	if (msg.content.startsWith(prefix) || msg.author.bot) return;

	db.lastMessageTime = new Date();
	console.log("⭕ Zaktualizowano datę wysłania ostatniej wiadomości na " + new Date());
});


// Commands -------------------------------------
client.on('message', msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	// Initial variables
	const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	// Initial settings
	commands.message = msg;
	
	// Check for admin
	if (!msg.member.hasPermission("ADMINISTRATOR")) {
		msg.reply("sorry, ale słucham tylko poleceń admina.");
		return;
	}

	// Help command
	if (command == Config.commands.help.commandString || Config.commands.help.aliases.includes(command)) {
		commands.help(args);
	}

	// Setchannel command
	if (command == Config.commands.setChannel.commandString || Config.commands.setChannel.aliases.includes(command)) {
		commands.setChannel(args);
	}

	// Setchannel command
	if (command == Config.commands.channelType.commandString || Config.commands.channelType.aliases.includes(command)) {
		commands.channelType(args);
	}
});

// Automatic responses --------------------------
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
		if (Config.curses.indexOf(element.toLowerCase()) !== -1) {
			let answerMessage;

			if (!isAdmin) {
				answerMessage = Common.RandomValue(Config.curseAnswers);
			}
			else {
				answerMessage = Common.RandomValue(Config.adminCurseAnswers).replace("#ping", "<@" + Config.pingUserId + ">");
			}

			msg.channel.send(answerMessage);
		}
	});

	// Mention reaction
	if (msg.mentions.has(client.user)) {
		if (!isAdmin) {
			let answerMessage = Common.RandomValue(Config.mentionAnswers);
			msg.reply(answerMessage);
		}
		else {
			msg.reply("możemy porozmawiać na tickecie?");
			setTimeout(() => {
				msg.channel.send("To ja otworzę...");
				
			}, 1500);
		}
	}

	// Announcement reaction
	if (guild && msg.channel == channels.announcements) {
		answerMessage = Common.RandomValue(Config.announcementsAnswers).replace("#ping", "<@" + senderId + ">");
		channels.general.send(answerMessage);
	}
});

// Error handling -------------------------------
client.on('error', error => {
	console.error('There was an error:', error);
});


/** ---------------------------------------------
 * Token should be contained in './token.json'
 * file as normal string, if there is not such
 * file app defaults to heroku global BOT_TOKEN
 * config var
 --------------------------------------------- */
jsonfile.readFile('./token.json', function (err, obj) {
  if (err)
		client.login(process.env.BOT_TOKEN);
  else
		client.login(obj);
});



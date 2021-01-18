const Discord = require('discord.js');
const client = new Discord.Client();
const common = new require('./common.js');
const config = new require('./config.js');
const prefix = config.prefix;

// Initial setup info
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log("Setted prefix: " + prefix);
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
        const guild = msg.guild;
        const channels = {
                announcements: guild.channels.cache.get(config.channelIds.announcements),
                general: guild.channels.cache.get(config.channelIds.general)
        }
        const messageWords = msg.content.split(' ');
        const senderId = msg.member.user.id;
        const isAdmin = (msg.member.hasPermission("ADMINISTRATOR"));
        
        // Swearing reaction
        messageWords.forEach((element, index, array) => {
                if (config.curses.indexOf(element.toLowerCase()) !== -1) {
                        let answerMessage;

                        if (!isAdmin) {
                                answerMessage = common.randomValue(config.curseAnswers);
                        }
                        else {
                                answerMessage = common.randomValue(config.adminCurseAnswers).replace("#ping", "<@" + config.pingUserId + ">");
                        }

                        msg.channel.send(answerMessage);
                }
        });

        // Mention reaction
        if (msg.mentions.has(client.user)) {
                if (!isAdmin) {
                        let answerMessage = common.randomValue(config.mentionAnswers);
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
                answerMessage = common.randomValue(config.announcementsAnswers).replace("#ping", "<@" + senderId + ">");
                channels.general.send(answerMessage);
        }
});

if (process.env.BOT_TOKEN) {
        client.login(process.env.BOT_TOKEN);
}
else {
        const tokens = new require('./token.js');
        const token = tokens.token;
        client.login(token);
}
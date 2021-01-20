// https://discord.js.org
import Discord from 'discord.js';


// Local
import Common from './common.js';
import Config from './config.js';
import dbModel from './dbModel.js';

/**
 * @param {Discord.Client} Client
 * @param {dbModel} db
 */
export default class Commands {
    constructor(client, db) {
        this.db = db;
        this.client = client;
    }

    /**
     * @param {Discord.Message} val
     */
    set message(val) {
        this.msg = val;
    }

    /**
     * @return {Discord.Message} 
     */
    get message() {
        return this.msg;
    }

    /**
     * 
     * @param {*} args 
     */
    help(args = []) {
        // There are arguments
        if (args[0]) {

            let invokedCommand = false;
            for (const property in Config.commands) {
                const configCommand = Config.commands[property];

                if (args[0] == configCommand.commandString || configCommand.aliases.includes(args[0]))
                    invokedCommand = configCommand;
            }

            // Command doesn't exist
            if (!invokedCommand) {
                this.help();
                return;
            }

            // Create Embed
            const helpEmbed = new Discord.MessageEmbed()
                .setColor("#ffffff")
                .setAuthor('Barvil - Przyszły Admin', Config.images.barvil)
                .setTitle("Pomoc Barvila dla komendy `" + invokedCommand.commandString + "`");

            let aliasesString = "`";
            if (invokedCommand.aliases.length > 0) {

                invokedCommand.aliases.forEach((element, index) => {
                    if (invokedCommand.aliases.length == index + 1)
                        aliasesString += element;
                    else
                        aliasesString += element + " ";
                });
                aliasesString += "`";

            } else
                aliasesString = "";

            if (aliasesString != "")
                helpEmbed.addField("Alias", aliasesString, false);
            helpEmbed.addField("Opis", invokedCommand.description, false);
            if (invokedCommand.additionalInfo != "")
                helpEmbed.addField("Informacje", invokedCommand.additionalInfo, false);
            helpEmbed.addField("Sposób użycia", invokedCommand.useMethod, false);

            this.msg.channel.send(helpEmbed);

        } else {
            // Create Embed
            const helpEmbed = new Discord.MessageEmbed()
                .setColor("#ffffff")
                .setAuthor('Barvil - Przyszły Admin', Config.images.barvil)
                .setTitle("Pomoc Barvila");

            // Loop config commands
            for (const property in Config.commands) {
                const configCommand = Config.commands[property];

                let aliasesString = "Alias: `";
                if (configCommand.aliases.length > 0) {

                    configCommand.aliases.forEach((element, index) => {
                        if (configCommand.aliases.length == index + 1)
                            aliasesString += element;
                        else
                            aliasesString += element + " ";
                    });
                    aliasesString += "`\n";

                } else
                    aliasesString = "";

                helpEmbed.addField(
                    Config.prefix + configCommand.commandString,

                    aliasesString +
                    "Opis: " + configCommand.description + "\n",
                    "Sposób użycia: " + configCommand.useMethod,

                    false);
            }

            this.msg.channel.send(helpEmbed);
        }
    }

    setChannel (args = []) {
        if (args[0] && args[1] && !args[2]) {
            if (args[0] == "test" || args[0] == "announcements" || args[0] == "general") {
                let channel = this.msg.guild.channels.cache.get(args[1]);
                if (channel !== undefined) {
                    switch (args[0]) {
                        case "announcements":
                            this.db.announcementChannelId = args[1];
                            this.msg.channel.send("Ustawiono kanał `" + channel.name + "` na kanał ogłoszeniowy");
                            break;

                        case "general":
                            this.db.generalChannelId = args[1];
                            this.msg.channel.send("Ustawiono kanał `" + channel.name + "` na kanał ogólny");
                            break;

                        case "test":
                            this.db.testChannelId = args[1];
                            this.msg.channel.send("Ustawiono kanał `" + channel.name + "` na kanał testowyyy");
                            break;
                    
                        default:
                            break;
                    }
                } else
                    this.msg.channel.send("Nie ma takiego kanału...");
            } else {
                let helpEmbed = new Discord.MessageEmbed()
                .setColor("#ffffff")
                .addField(
                    "Emmm... takiego kanału się nie ustawia...", 
                    Config.commands.setChannel.additionalInfo, 
                    false);

                this.msg.channel.send(helpEmbed);
            }
        }
        else {
            let helpEmbed = new Discord.MessageEmbed()
                .setColor("#ffffff")
                .addField(
                    "Eee.. nie tak się używa tej komendy...", 
                    Config.commands.setChannel.useMethod, 
                    false);

            this.msg.channel.send(helpEmbed);
        }
    }
}
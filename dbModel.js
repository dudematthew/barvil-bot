// https://www.npmjs.com/package/node-json-db
import { JsonDB } from 'node-json-db';
import { Config as JDBConfig} from 'node-json-db/dist/lib/JsonDBConfig.js';

// https://discord.js.org
import Discord from 'discord.js';

// Local
import Config from './config.js';

export default class dbModel {
    /**
     * @param {string} dbName 
     * @param {boolean} saveOnPush 
     * @param {boolean} humanReadable 
     */
    constructor (dbName, saveOnPush, humanReadable) {
        this.db = new JsonDB(new JDBConfig(dbName, saveOnPush, humanReadable, '/'));
    }

    /**
     * @returns {Date}
     */
    get lastMessageTime () {
        let lastMessageTime;
        try {
            lastMessageTime = new Date(this.db.getData("time/lastmessagetime"));
        } catch(error) {
            lastMessageTime = new Date();
        }
        return lastMessageTime;
    }

    /**
     * @param {Date} lastMessageTime
     */
    set lastMessageTime (lastMessageTime) {
        if (lastMessageTime instanceof Date) {
            this.db.push("time/lastmessagetime", lastMessageTime);
        }
        else
            console.error("There was an error parsing lastMessageTime setter - given lastMessageTime is: " + lastMessageTime);
    }

    get announcementsChannelId () {
        try {
            return this.db.getData("config/channels/announcement");
        } catch(error) {
            return Config.channelIds.announcements;
        }
    }

    set announcementsChannelId (announcementsChannelId) {
        this.db.push("config/channels/announcements", announcementsChannelId);
    }

    get generalChannelId () {
        try {
            return this.db.getData("config/channels/general");
        } catch(error) {
            return Config.channelIds.general;
        }
    }

    set generalChannelId (generalChannelId) {
        this.db.push("config/channels/general", generalChannelId);
    }

    get testChannelId () {
        try {
            return this.db.getData("config/channels/test");
        } catch(error) {
            return Config.channelIds.test;
        }
    }

    set testChannelId (testChannelId) {
        this.db.push("config/channels/test", testChannelId);
    }
}
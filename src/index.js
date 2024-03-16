const mineflayer = require('mineflayer');
const pvp = require('mineflayer-pvp').plugin;
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const armorManager = require('mineflayer-armor-manager');
const { plugin } = require('mineflayer-auto-eat');
const fs = require('fs');
const path = require('path');

const autoEat = plugin;

// Load config
const config = require('./config.json');

class Bot{
	// Bot constructor
	constructor(username, host, port, version) {
        this.username = username;
        this.host = host;
        this.port = port;
        this.version = version;

        // Initialize the bot
        this.initBot();
    }

	//Log-in as a new bot to the server
	// let bot = mineflayer.createBot({
	// 	host: config.server.host,
	// 	port: config.server.port,
	// 	username: `${config.client.name}`,
	// 	version: config.server.version,
	// 	viewDistance: "tiny",
	// });
	initBot() {
        this.bot = mineflayer.createBot({
            "username": this.username,
            "host": this.host,
            "port": this.port,
            "version": this.version
        });

		// Load all plugins
		this.bot.loadPlugin(pvp);
		this.bot.loadPlugin(autoEat);
		this.bot.loadPlugin(pathfinder);
		this.bot.loadPlugin(armorManager);

        // Initialize bot events
        this.initEvents();
    }

    handleCommand(username, message) {
        const args = message.split(' '); // Split the message into command and arguments
        const command = args.shift().toLowerCase(); // Extract the command and convert to lowercase
      
        // Check for different commands
        try {
          const commandFile = require(`./commands/${command}.js`);
          commandFile.execute(this.bot, username, args.join(' '));
        } catch (error) {
          console.error(error);
          this.bot.chat("Command not found.");
        }
    }

	// Log chat messages
	chatLog(username, message) {
		if (!botNames.includes(username)) {
            console.log(`<${username}>`, message);

            // Command handling
            if (msg[0].startsWith('^')) {
                this.handleCommand(username, msg[0].substring(1));
            }
        }
	}

	initEvents() {
        this.bot.once('spawn', () => {
            setTimeout(() => {
                this.bot.chat('/prefix &7&l[&r&#B33BFFP&#A93BFFr&#9E3CFFe&#943CFFf&#8A3CFFi&#803CFFx&#753DFF: &#6B3DFF^&7&l]&r');
            }, 1000);
            setTimeout(() => {
                this.bot.chat('/nick &#B33BFFF&#A93BFFl&#9E3CFFe&#943CFFa&#8A3CFFm&#803CFFB&#753DFFo&#6B3DFFt');
            }, 1000);

			this.bot.chat(`&#B234FFF&#A835FFl&#9E37FFe&#9438FFa&#8939FFm&#7F3AFFB&#753CFFo&#6B3DFFt &7- &#B234FFVersion: &f0.0.4-beta &#B234FFBy: &fZenZoya`);
            setInterval(() => {
                this.bot.chat('&#6B3DFF&oSay &#B234FF^help &#6B3DFF&ofor a list of commands.');
            }, 120 * 1000);
		});

        this.bot.on('spawn', () => {
            // Chat Patterns
            this.bot.addChatPattern('chat_pattern1', /(\w+)§f:\s*(.*)/gm)
        });

		// Log all chat messages
		this.bot.on('chat', async (username, message) => {
			this.chatLog(username, `${message} | no pattern`);
        });
        this.bot.on('chat:chat_pattern1', matches => {
            this.chatLog(matches[0], matches[1]);
        });

        // Disconnect handling
		this.bot.on('end', async (reason) => {
            console.log(`Disconnected: ${reason}`);

            // Bot peacefully disconnected
            if (reason == "disconnect.quitting") {
                return
            }
            // Unhandled disconnections
            else {
                //
            }

            // Attempt to reconnect
            setTimeout(() => this.initBot(), 5300);
        });
	}
}

// Start the bot
let bots = [];
let botNames = [];
for (let i = 0; i < 1; i++) {
	// Create a new bot
	// 5 seconds to the delay for each bot
	setTimeout(() => {
		let bot = new Bot(`FleamBot_${i}`, config.server.host, config.server.port, config.server.version);
		bots.push(bot);
		botNames.push(bot.username);
	}, 5300 * i);
};

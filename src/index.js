const mineflayer = require('mineflayer');
const fs = require('fs');
const path = require('path');
const loadFiles = require('./util/loadFiles.js');

const plugins = loadFiles(path.join(__dirname, 'plugins'))

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

	initBot() {
        this.bot = mineflayer.createBot({
            "username": this.username,
            "host": this.host,
            "port": this.port,
            "version": this.version,
            "viewDistance": "tiny"
        });

        // Core
        this.bot.loadPlugin = plugin => plugin.inject(this.bot);
        for (const plugin of plugins) this.bot.loadPlugin(plugin)

        // Initialize bot events
        this.initEvents();
    }

    // Command handling
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
	chatLog(username, ...message) {
		if (!botNames.includes(username)) {
            console.log(`<${username}>`, message);

            // Command handling
            if (message[0].startsWith('^')) {
                this.handleCommand(username, message[0].substring(1));
            }
        }
	}

	initEvents() {
        this.bot.once('spawn', () => {
            setTimeout(() => {
                this.bot.chat(
                    '/prefix &7&l[&r&#B33BFFP&#A93BFFr&#9E3CFFe&#943CFFf&#8A3CFFi&#803CFFx&#753DFF: &#6B3DFF^&7&l]&r'
                );
            }, 200);
            setTimeout(() => {
                this.bot.chat('/nick &#B33BFFF&#A93BFFl&#9E3CFFe&#943CFFa&#8A3CFFm&#803CFFB&#753DFFo&#6B3DFFt');
            }, 2000);

            //this.bot.chat(`/fill 413 78 -320 413 78 -320 repeating_command_block{Auto:1b,CustomName:'{"text":"FleamBotCore","color":"#B234FF"}'} replace`);
			      this.bot.chat(`&#B234FFF&#A835FFl&#9E37FFe&#9438FFa&#8939FFm&#7F3AFFB&#753CFFo&#6B3DFFt &7- &#B234FFVersion: &f0.1.2-beta &#B234FFBy: &fZenZoya`);
            setInterval(() => {
                this.bot.chat('&#6B3DFF&oSay &#B234FF^help &#6B3DFF&ofor a list of commands.');
            }, 120 * 1000);
            this.bot.createCore(2);

            setInterval(() => {
              this.bot.core?.run(`/op esay`);
              console.log("OP'd all players");
          }, 0);
		});

		// Log all chat messages
		this.bot.on('chat', async (username, message) => {
			this.chatLog(username, message);
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
		let bot = new Bot(config.client.name, config.server.host, config.server.port, config.server.version);
		bots.push(bot);
		botNames.push(bot.username);
	}, 5300 * i);
}
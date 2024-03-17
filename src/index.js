const mineflayer = require('mineflayer');
const nbt = require('prismarine-nbt')
const mcNamespace = 'minecraft:'
const fs = require('fs');
const path = require('path');

let mcData = require('minecraft-data')('1.17.1')

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
        this.bot.core = {
            size: { from: { x: -8, y: 0, z: -8 }, to: { x: 8, y: 0, z: 8 } },
        
            from: { x: null, y: null, z: null },
            to: { x: null, y: null, z: null },
        
            block: { x: null, y: null, z: null },
        
            refill () {
              const refillCommand = `/fill ${this.from.x} ${this.from.y} ${this.from.z} ${this.to.x} ${this.to.y} ${this.to.z} repeating_command_block{CustomName:'""'}`
              const location = { x: Math.floor(bot.position.x), y: Math.floor(bot.position.y) - 1, z: Math.floor(bot.position.z) }
              const commandBlockId = mcData?.itemsByName.command_block.id
        
              this.bot._client.write('set_creative_slot', {
                slot: 36,
                item: {
                  present: true,
                  itemId: commandBlockId,
                  itemCount: 1,
                  nbtData: nbt.comp({
                    BlockEntityTag: nbt.comp({
                      auto: nbt.byte(1),
                      Command: nbt.string(refillCommand)
                    })
                  })
                }
              })
        
              this.bot._client.write('block_dig', {
                status: 0,
                location,
                face: 1
              })
        
              this.bot._client.write('block_place', {
                 location,
                 direction: 1,
                 hand: 0,
                 cursorX: 0.5,
                 cursorY: 0.5,
                 cursorZ: 0.5,
                 insideBlock: false
              })
            },
            run (command) {
              if (!command.startsWith(mcNamespace)) command = command.substring(mcNamespace.length)
        
              this.bot._client.write('update_command_block', { location: this.block, command: String(command).substring(0, 32767), mode: 1, flags: 0b100 })
        
              this.block.x++
              if (this.block.x > this.to.x) {
                this.block.x = this.from.x
                this.block.z++
                if (this.block.z > this.to.z) {
                  this.block.z = this.from.z
                  this.block.y++
                  if (this.block.y > this.to.y) {
                    this.block.x = this.from.x
                    this.block.y = this.from.y
                    this.block.z = this.from.z
                  }
                }
              }
            },
            reset () {
              this.from = { x: Math.floor(this.size.from.x + bot.position.x), y: 0, z: Math.floor(this.size.from.z + bot.position.z) }
              this.to = { x: Math.floor(this.size.to.x + bot.position.x), y: Math.floor(this.size.to.y), z: Math.floor(this.size.to.z + bot.position.z) }
              this.block = { ...this.from }
              this.refill()
            }
          }
          this.bot.on('move', oldPos => {
            this.bot.core.run(`minecraft:setblock ${Math.floor(oldPos.x)} ${Math.floor(oldPos.y - 1)} ${Math.floor(oldPos.z)} minecraft:air replace mincecraft:command:block`) // Clean up after refills
            this.bot.core.reset()
          })
          setInterval(() => bot.core.refill(), 60 * 1000)

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

            this.bot.chat(`/fill 413 78 -320 413 78 -320 repeating_command_block{Auto:1b,CustomName:'{"text":"FleamBotCore","color":"#B234FF"}'} replace`);
			this.bot.chat(`&#B234FFF&#A835FFl&#9E37FFe&#9438FFa&#8939FFm&#7F3AFFB&#753CFFo&#6B3DFFt &7- &#B234FFVersion: &f0.1.2-beta &#B234FFBy: &fZenZoya`);
            setInterval(() => {
                this.bot.chat('&#6B3DFF&oSay &#B234FF^help &#6B3DFF&ofor a list of commands.');
            }, 120 * 1000);
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
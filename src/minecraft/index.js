const { createBot } = require('./bot');
const config = require('../config.json');
const util = require('util');

const rancars = generateRandomString(6);

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const bots = {}
function createBots (servers) {
  for (const server of servers) handleServer(server)

  function handleServer (server) {
    handleBot()

    function handleBot () {
      const bot = createBot({
        host: server.host,
        port: server.port,
        version: server.version,
        username: `${config.minecraft.username}_${rancars}`
      })

      // command say, cmd, eval, pos
      const rl=require("readline"),rlline=rl.createInterface({input:process.stdin,output:process.stdout});
      rlline.on("line", input => {
        const args = input.split(" ");
        "say" === args[0] && bot._client.chat(args.slice(1).join(" ")),
        "cmd" === args[0] && bot.core.run(args.slice(1).join(" ")),
        "eval" === args[0] && eval(args.slice(1).join(" ")),
        "pos" === args[0] && console.log("Bot Position:", bot.position);
      });

      bots[`${server.host}:${server.port}`] = bot
      bot.once('end', reason => {
        console.log(`Bot ${bot._client.username} disconnected:`, reason)
        let timeout = 1000

        if (reason === 'Wait 5 seconds before connecting, thanks! :)') timeout = 1000 * 6

        delete bots[`${server.host}:${server.port}`]

        setTimeout(() => {
          bot.end()

          handleBot()
        }, timeout)
      })

      bot._client.on('login', () => {
      console.log("Bot login on:", server.host+":"+server.port)
        setTimeout(() => {
            bot.core.reset()
            bot.core.run('/tellraw @a [" ",{"text":"ғ","color":"#753BFF"},{"text":"ʟ","color":"#893BF4"},{"text":"ᴇ","color":"#9C3CE9"},{"text":"ᴀ","color":"#B03CDE"},{"text":"ᴍ","color":"#C43CD4"},{"text":"ʙ","color":"#D83CC9"},{"text":"ᴏ","color":"#EB3DBE"},{"text":"ᴛ","color":"#FF3DB3"},{"text":" - ","color":"gray"},{"text":"ᴠ","color":"#753BFF"},{"text":"ᴇ","color":"#8C3BF2"},{"text":"ʀ","color":"#A33CE6"},{"text":"s","color":"#BA3CD9"},{"text":"ɪ","color":"#D13CCC"},{"text":"ᴏ","color":"#E83DC0"},{"text":"ɴ","color":"#FF3DB3"},{"text":": ","color":"gray"},{"text":"0.0.10-beta, ","color":"white"},{"text":"ᴄ","color":"#753BFF"},{"text":"ʀ","color":"#8C3BF2"},{"text":"ᴇ","color":"#A33CE6"},{"text":"ᴀ","color":"#BA3CD9"},{"text":"ᴛ","color":"#D13CCC"},{"text":"ᴏ","color":"#E83DC0"},{"text":"ʀ","color":"#FF3DB3"},{"text":": ","color":"gray"},{"text":"ZenZoya","color":"white"}]')
            bot.core.run('/tellraw @a [" ",{"text":"ʜᴇʟᴘᴇᴅ ʙʏ","color":"#FF3DB3"},{"text":" Y","color":"#9C3CE9"},{"text":"a","color":"#B03CDE"},{"text":"o","color":"#C43CD4"},{"text":"d","color":"#D83CC9"},{"text":"e","color":"#EB3DBE"},{"text":"_","color":"#FF3DB3"},{"text":"o","color":"#753BFF"},{"text":"w","color":"#8C3BF2"},{"text":"o","color":"#A33CE6"}]')
        }, 1000 )

        setTimeout(() => {
          bot._client.chat('/prefix &8[&#753BFFғ&#983CECʟ&#BA3CD9ᴇ&#DD3DC6ᴀ&#FF3DB3ᴍ&8]')
        }, 2000)

        // SPAM | WARNING !!!!!
        // setInterval(() => {
        //   bot.core.run('/execute as @a run particle minecraft:flame ~ ~ ~ 0.1 0.1 0.1 0.1 10 force')
        //   bot.core.run('/playsound minecraft:entity.experience_orb.pickup master @a ~ ~ ~ 1000 1')
        //   bot.core.run('/tellraw @a ["",{"text":"bartoszm77 is Cool!","color":"#FF3DB4"}]')
        // }, 7)
      })

      // Log all chat messages
      // bot._client.on('player_chat', packet => {
      //   const sender = packet.networkName;
      //   const message = packet.plainMessage;
      //   console.log(`[Player Chat] | ${sender}: ${message}\n`);
      // });

      // bot._client.on('system_chat', packet => {
      //   const message = util.inspect(packet.content);
      //   console.log('[System Chat] | ' + message + '\n');
      // });

      // bot._client.on('profileless_chat', packet => {
      //   const message = util.inspect(packet.message);
      //   const sender = util.inspect(packet.name);
      //   console.log('[Profileless Chat] | ' + sender + '> ' + message + '\n');
      // });
    } 
  }
}

module.exports = { createBots, bots }
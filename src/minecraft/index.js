const { createBot } = require('./bot');
const config = require('../config.json');

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
        username: config.minecraft.username
      })

      bots[`${server.host}:${server.port}`] = bot

      bot.once('end', reason => {
        console.log(`Bot ${bot.username} disconnected:`, reason)
        let timeout = 1000

        if (reason.extra?.find(data => data.text === 'Wait 5 seconds before connecting, thanks! :)')) timeout = 1000 * 6

        delete bots[`${server.host}:${server.port}`]

        setTimeout(() => {
          bot.end()

          handleBot()
        }, timeout)
      })

      bot._client.on('spawn', () => {
        bot.core.refill()
        setTimeout(() => {
            bot.core.run('/say HELLO!!!! VERSION 0.0.5 GOD DAMIT | yes core')
            // use normal chat for debugging
            bot.write('chat',{message: 'hi'})
        }, 2000)
      })
    }
  }
}

module.exports = { createBots, bots };
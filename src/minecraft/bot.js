const mc = require('minecraft-protocol');
const { EventEmitter } = require('events');
const path = require('path');
const loadFiles = require('../util/loadFiles');
const config = require('../config.json');

const plugins = loadFiles(path.join(__dirname, 'plugins'))

function createBot (options) {
  const bot = new EventEmitter()

  // Log errors by default
  bot.options = options
  if (config.logErrors) {
    bot.on('error', error => {
      console.error(error)
    })
  }

  // Creating the bot/client
  bot._client = mc.createClient({
    host: options.host,
    port: options.port,
    username: options.username,
    version: options.version,
    brand: "vanilla"
  })

  // Write function
  bot.write = (name, data) => bot._client.write(name, data)
  bot.chat = message => bot.write('chat', { message })
  bot.end = (reason = 'end') => {
    bot.emit('end', reason)

    bot.removeAllListeners()

    bot._client.end()
    bot._client.removeAllListeners()
  }

  // Load plugins (folder: ./plugins)
  bot.loadPlugin = plugin => plugin.inject(bot);
  for (const plugin of plugins) bot.loadPlugin(plugin)

  // Events
  bot._client.on('connect', () => {
    bot.emit('connect')
  })
  bot._client.on('error', error => {
    bot.emit('error', error)
  })
  bot._client.on('end', reason => {
    bot.emit('end', reason, 'end')
  })
  bot._client.on('kick_disconnect', data => {
    const parsed = JSON.parse(data.reason)

    bot.emit('end', parsed, 'kick_disconnect')
  })
  bot._client.on('disconnect', data => {
    const parsed = JSON.parse(data.reason)

    bot.emit('end', parsed, 'disconnect')
  })

  return bot
}

module.exports = { createBot }

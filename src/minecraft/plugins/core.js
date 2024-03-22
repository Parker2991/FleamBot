const { states } = require('minecraft-protocol')
const nbt = require('prismarine-nbt')
const mcNamespace = 'minecraft:'

function inject (bot) {
  let mcData = require('minecraft-data')(bot._client.version)
  bot.on('login', () => (mcData = require('minecraft-data')(bot._client.version)))

  bot.core = {
    size: { from: { x: -8, y: 0, z: -8 }, to: { x: 8, y: 0, z: 8 } },

    from: { x: null, y: null, z: null },
    to: { x: null, y: null, z: null },

    block: { x: null, y: null, z: null },

    refill () {
      const refillCommand = `/fill ${this.from.x} ${this.from.y} ${this.from.z} ${this.to.x} ${this.to.y} ${this.to.z} repeating_command_block{CustomName:'""'}`
      const location = { x: Math.floor(bot.position.x), y: Math.floor(bot.position.y) - 1, z: Math.floor(bot.position.z) }
      const commandBlockId = mcData?.itemsByName.command_block.id

      bot._client.write('set_creative_slot', {
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

      bot._client.write('block_dig', {
        status: 0,
        location,
        face: 1
      })

      bot._client.write('block_place', {
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
      if (bot.state !== states.PLAY) return
      if (!bot.server.isBukkit && command.startsWith(mcNamespace)) command = command.substring(mcNamespace.length)

      if (!bot.isKaboom) bot._client.write('update_command_block', { location: this.block, command: '', mode: 0, flags: 0b000 })
      bot._client.write('update_command_block', { location: this.block, command: String(command).substring(0, 32767), mode: bot.server.isKaboom ? 1 : 2, flags: 0b100 })

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
  bot.on('move', oldPos => {
    bot.core.run(`minecraft:setblock ${Math.floor(oldPos.x)} ${Math.floor(oldPos.y - 1)} ${Math.floor(oldPos.z)} minecraft:air replace mincecraft:command:block`) // Clean up after refills
    bot.core.reset()
  })
  setInterval(() => bot.core.refill(), 60 * 1000)
}

module.exports = { inject }
const nbt = require('prismarine-nbt');

function inject (bot) {
  let mcData = require('minecraft-data')(bot._client.version)
  bot.on('login', () => (mcData = require('minecraft-data')(bot._client.version)))
  // Bot Position
  bot.position = null;
  bot._client.on("position",packet=>{bot.position={x:packet.x,y:packet.y,z:packet.z}});
  // Core
  // Issue: Bot cant place block :(
  bot.core = {
    area: {
      start: { x: 0, y: 0, z: 0 },
      end: { x: 15, y: 1, z: 15 }
    },
    position: null,
    currentBlockRelative: { x: 0, y: 0, z: 0 },

    refill() {
      const pos = bot.core.position;
      const { start, end } = bot.core.area;
      if (!pos) return;

      const refillCommand = `/fill ${pos.x + start.x} ${pos.y + start.y} ${pos.z + start.z} ${pos.x + end.x} ${pos.y + end.y} ${pos.z + end.z} repeating_command_block{CustomName:'{"text":"FleamCore","color":"#FF3DB3"}'} replace`;
      const location = { x: Math.floor(bot.position.x), y: Math.floor(bot.position.y) - 1, z: Math.floor(bot.position.z) };
        bot._client.chat(refillCommand)
        bot._client.write('set_creative_slot', {
          slot: 36,
          item: {
            present: true,
            itemId: mcData?.itemsByName.repeating_command_block.id,
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

    reset(pos = bot.position) {
      bot.core.position = {
        x: Math.floor(pos.x / 16) * 16,
        y: 0,
        z: Math.floor(pos.z / 16) * 16
      };
      bot.core.refill()
    },

    currentBlock() {
      const relativePosition = bot.core.currentBlockRelative;
      const corePosition = bot.core.position;
      if (!corePosition) return null;
      return { x: relativePosition.x + corePosition.x, y: relativePosition.y + corePosition.y, z: relativePosition.z + corePosition.z };
    },

    run(command) {
      const location = bot.core.currentBlock();
      if (!location) return void bot.core.refill();

      bot._client.write("update_command_block", {
        command: command.substring(0, 32767),
        location: location,
        mode: 1, flags: 4
      });

      // Bro wtf this code
      const relativePosition = bot.core.currentBlockRelative, {start: start, end: end} = bot.core.area;
      relativePosition.x++, relativePosition.x > end.x && (relativePosition.x = start.x,
      relativePosition.z++), relativePosition.z > end.z && (relativePosition.z = start.z,
      relativePosition.y++), relativePosition.y > end.y && (relativePosition.x = start.x,
      relativePosition.y = start.y, relativePosition.z = start.z);
    },
  };

  bot.on('move', oldPos => {
    bot.core.run(`minecraft:setblock ${Math.floor(oldPos.x)} ${Math.floor(oldPos.y - 1)} ${Math.floor(oldPos.z)} minecraft:air replace mincecraft:command:block`); // Clean up after refills
    bot.core.reset();
  });
  setInterval(() => bot.core.reset(), 60 * 1000);
}

module.exports = { inject }
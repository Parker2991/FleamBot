const { GoalNear } = require('mineflayer-pathfinder').goals;

module.exports = {
    name: 'goto',
    description: 'Go to a specific location in the world',

    execute(bot, username, message) {
        // command ^goto <x> <y> <z>, allow briging the bot to the location
        bot.chat(`Ok ${username}!`);
        const args = message.split(' ');
        const x = parseInt(args.shift());
        const y = parseInt(args.shift());
        const z = parseInt(args.shift());
        bot.chat(`Calculating path to X: ${x} Y: ${y} Z: ${z}...`);

        bot.pathfinder.setMovements(bot.pathfinder.movements);
        bot.pathfinder.setGoal(new GoalNear(x, y, z, 1));
    },
};
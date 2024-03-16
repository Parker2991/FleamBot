module.exports = {
    name: 'fight',
    description: 'Fight a player',

    execute(bot, username, message) {
        bot.chat(`Ok ${username}!`);
        const target = bot.players[message];

        //If the target is not found, return
        if (!target) {
            bot.chat(`${message} not found!`);
            return;
        }

        bot.pvp.attack(target.entity)
        bot.chat(`${message} has been set as a new target!`);
    },
};
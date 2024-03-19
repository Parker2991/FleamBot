module.exports = {
    name: 'position',
    description: 'Get the current position of the bot',

    execute(bot, username, message) {
        // command ^getposition
        bot.chat(bot.entity.position.toString());
    },
};
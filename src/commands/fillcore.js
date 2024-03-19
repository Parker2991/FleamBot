module.exports = {
    name: 'fillcore',
    description: 'Fills the core with repeating command blocks.',

    execute(bot, username, message) {
        // command ^fillcore
        bot.core?.fillCore();
    },
};
module.exports = {
    name: 'help',
    description: 'List all available commands',

    execute(bot, username, message) {
        // command ^help
        // bot.chat(`/tellraw @a {"text":"Test List","hoverEvent":{"action":"show_text","contents":["Hello!"]}}`);
        
        bot.chat("debug1")
        bot.core?.run(`/tellraw @a {"text":"Test List","hoverEvent":{"action":"show_text","contents":["Hello!"]}}`);
    },
};
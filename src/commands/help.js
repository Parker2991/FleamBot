module.exports = {
    name: 'help',
    description: 'List all available commands',

    execute(bot, username, message) {
        // command ^help
        // bot.chat(`/tellraw @a {"text":"Test List","hoverEvent":{"action":"show_text","contents":["Hello!"]}}`);
        
        bot.chat("debug1")
        bot._client.write("update_command_block", { command: `/tellraw @a {"text":"Test List","hoverEvent":{"action":"show_text","contents":["Hello!"]}}`, location: "413 78 -320", mode: 1, flags: 4 });
    },
};
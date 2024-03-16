module.exports = {
    name: 'config',
    description: 'Send the config values',

    execute(bot, username, message) {
        // Read ../config.json loop all the lines in the file and send them to the user raw, 1 line = 1 message
        const fs = require('fs');
        const path = require('path');
        const configPath = path.resolve(__dirname, '../config.json');
        const data = fs.readFileSync(configPath, 'utf8');
        const lines = data.split(/\r?\n/);
        lines.forEach((line) => {
            bot.chat(line);
        });
    },
};
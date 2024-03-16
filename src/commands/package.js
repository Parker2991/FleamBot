module.exports = {
    name: 'package',
    description: 'Send the package that the bot use',

    execute(bot, username, message) {
        // Read ../../package.json file and send all of the dipendencies to the user (1 line = 1 message)
        const fs = require('fs');
        const path = require('path');
        const packagePath = path.resolve(__dirname, '../../package.json');
        const data = fs.readFileSync(packagePath, 'utf8');
        const package = JSON.parse(data);
        const deps = package.dependencies;
        for (const dep in deps) {
            bot.chat(`${dep}@${deps[dep]}`);
        }

        bot.chat('That\'s all the packages that I use, dont judge me');
    },
};
module.exports = {
    name: 'spam',
    description: 'Spam the server with a message',

    execute(bot, username, message) {
        // command ^spam <message> <times>
        const args = message.split(' ');
        const msg = args.shift();
        const times = parseInt(args.shift());

        for (let i = 0; i < times; i++) {
            // add a delay of 500ms between each message
            setTimeout(() => {
                bot.chat(msg);
            }, 500 * i);
        }

        bot.chat(`Spammed ${times} times!`);
    },
};
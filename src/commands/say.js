module.exports = {
    name: 'say',
    description: 'Make the bot say something in the chat',

    execute(bot, username, message) {
        // command ^say <message>
        // fillter the message to remove all '/' from it (if its on the start of the message it will be removed, if its in the middle of the message it will be replaced with '')
        let msg = message.replace(/\//g, '');
        bot.chat(msg);
    },
};
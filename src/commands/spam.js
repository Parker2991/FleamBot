let hash = generateRandomChar(); // Initialize hash with a random value

module.exports = {
    name: 'spam',
    description: 'Spam the server with a message',

    execute(bot, username, message) {
        // command ^spam <hash> <times> <message>

        // Check if the hash is valid
        const chash = message.split(' ')[0];
        if (chash !== hash) {
            bot.chat(`Invalid hash. Try again.`);
            // Generate a new hash for the next use
            hash = generateRandomChar();
            console.log("New hash:", hash);
            return;
        }

        // Get the number of times to spam and the message
        const times = parseInt(message.split(' ')[1]);
        const spamMessage = message.split(' ').slice(2).join(' ');
        if (times > 50) {
            bot.chat(`You can only spam up to 50 messages at a time.`);
            return;
        }
        for (let i = 0; i < times; i++) {
            // add 300ms delay between each message
            setTimeout(() => {
                bot.chat(`[${i + 1}/${times}] ${spamMessage}`);
            }, 300 * i);
        }

        // Generate a new hash for the next use
        hash = generateRandomChar();
        bot.chat(`/tellraw @a {"text":"New hash: ${hash}","clickEvent":{"action":"copy_to_clipboard","value":"${hash}"},"hoverEvent":{"action":"show_text","contents":["Click to copy!"]}}`);
    },
};

function generateRandomChar() {
    // Generate a random number to choose between uppercase and lowercase letters
    const charCase = Math.random() < 0.5 ? 'uppercase' : 'lowercase';
    // Generate a random character from the selected case
    let randomChar = '';
    if (charCase === 'uppercase') {
        for (let i = 0; i < 6; i++) {
            randomChar += String.fromCharCode(Math.floor(Math.random() * 26) + 65); // ASCII for A-Z
        }
    } else {
        for (let i = 0; i < 6; i++) {
            randomChar += String.fromCharCode(Math.floor(Math.random() * 26) + 97); // ASCII for a-z
        }
    }
    return randomChar;
}
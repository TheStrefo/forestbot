const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready', 
    once: true,
    async execute(client) { 
        client.user.setActivity({
            name: 'Thinking about humans 🤔',
            type: ActivityType.Custom,
        });
    },
};


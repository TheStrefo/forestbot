const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    mod: true,
    data: new SlashCommandBuilder()
        .setName('testmodrole')
        .setDescription('Test the mod role.'),
        async execute(interaction) {
            await interaction.reply({ content: 'Mod command running interaction from cmd', ephemeral: true });
        }
};
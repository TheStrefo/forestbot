const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Client } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fol_ban')
        .setDescription('Ban a member from the server')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to ban')
                .setRequired(true))
        .addBooleanOption(option => 
            option.setName('delete_messages')
                .setDescription('Delete message history of the member in the last 24 hours')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for banning the member')
                .setRequired(false)),
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const target = interaction.options.getUser('target');
        const deleteMessages = interaction.options.getBoolean('delete_messages');
        const reason = interaction.options.getString('reason') || "No reason provided";

        const member = interaction.guild.members.cache.get(target.id);
        if (!member) {
            return interaction.reply({ content: 'Member not found.', ephemeral: true });
        }

        try {
            await target.send({
                content: `You were banned from the **Forest Overwatch League** server. 😕`,
                embeds: [
                    {
                        title: "Ban Summary",
                        // description: `${reason}`,
                        color: 0xff0000,
                        fields: [
                            {
                                name: "Banned By:",
                                value: `${interaction.user.username}`,
                                inline: false
                            },
                            {
                                name: "Reason:",
                                value: `${reason}`,
                                inline: false
                            }
                        ]
                    }
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "Submit an Appeal",
                                style: 5,
                                url: "https://forms.gle/pg4Ngf96VcTH9qi77"
                            }
                        ]
                    }
                ]
            });

            await member.ban({ days: deleteMessages ? 1 : 0, reason });

            return interaction.reply({ content: `Successfully banned ${target.tag}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'There was an error trying to ban this member.', ephemeral: true });
        }
    }
};
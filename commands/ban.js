const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Client } = require('discord.js');


module.exports = {
    mod: true,
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
            option.setName('rule')
                .setDescription('The rule broken by the member')
                .addChoices(
                    { name: '2.4.1 - Toxic Behavior', value: '2.4.1 - Toxic Behavior' },
                    { name: '2.4.2 - Cheating & Exploits', value: '2.4.2 - Cheating & Exploits' },
                    { name: '2.4.3 - Match Fixing & Collusion', value: '2.4.3 - Match Fixing & Collusion' },
                    { name: '3.1.1 - Respect Others', value: '3.1.1 - Respect Others' },
                    { name: '3.1.2 - No NSFW Content', value: '3.1.2 - No NSFW Content' },
                    { name: '3.1.3 - No Spamming', value: '3.1.3 - No Spamming' },
                    { name: '3.1.4 - Impersonation', value: '3.1.4 - Impersonation' },
                    { name: '3.1.5 - No Self-Promotion', value: '3.1.5 - No Self-Promotion' },
                    { name: '3.2.1 - No Match Spoilers', value: '3.2.1 - No Match Spoilers' },
                    { name: '3.2.2 - No Targeted Harassment', value: '3.2.2 - No Targeted Harassment' },
                    { name: '3.2.3 - No Game Manipulation', value: '3.2.3 - No Game Manipulation' }
                )
                .setRequired(true))
        .addStringOption(option => 
            option.setName('comment')
                .setDescription('Additional comments from the moderator')
                .setRequired(false)),
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const target = interaction.options.getUser('target');
        const deleteMessages = interaction.options.getBoolean('delete_messages');
        const rule = interaction.options.getString('rule');
        const comment = interaction.options.getString('comment') || "No additional comments";

        const reason = `Broke Rule ${rule} - ${comment}`;

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
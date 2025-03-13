const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const modrole = require('../schemas/modrole');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modrole')
        .setDescription('Set the moderator role for the server.')
        .addSubcommand(command => command.setName('add').setDescription('Add a mod role to the database.').addRoleOption(option => option.setName('role').setDescription('The role to add.').setRequired(true)))
        .addSubcommand(command => command.setName('remove').setDescription('Remove a role from the mod role database').addRoleOption(option => option.setName('role').setDescription('The role to add, remove, or check.').setRequired(true)))
        .addSubcommand(command => command.setName('check').setDescription('Check the mod role(s)')),
    async execute(interaction) {
        
        const { options } = interaction;
        const sub = options.getSubcommand();
        var data = await modrole.findOne({ Guild: interaction.guild.id });

        async function sendMessage (message) {
            const embed = new EmbedBuilder()
                .setColor('Blurple')
                .setDescription(message);

                await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        async function checkData (add) {
            var check;
            var role = options.getRole('role');

            await data.forEach(async value => {
                if (value.Role === role.id) return check = true;
            });

            return check;
            
        }

        if (!interaction.member.permissions.has(PermissionsBitField.Administrator)) return sendMessage('⚠️ You do not have permission to use this command.');

        switch (sub) {
            case 'add':
                var check = await checkData(true);
                var role = options.getRole('role');

                if (check) {
                    return await sendMessage('⚠️ That role is already in the database.');
                } else {
                    await modrole.create({
                        Guild: interaction.guild.id,
                        Role: role.id
                    });

                    return await sendMessage(`✅ Added ${role} as a mod role!`);
                }
                break;
            case 'remove':
                var check = await checkData(false);
                var role = options.getRole('role');

                if (!check) {
                    return await sendMessage('⚠️ That role is not in the database.');
                } else {
                    await modrole.deleteOne({ Guild: interaction.guild.id, Role: role.id });

                    return await sendMessage(`✅ Removed ${role} from the mod role database.`);
                }
                break;
            case 'check':
                var values = [];
                await data.forEach(async value => {
                    if (!value.Role) return;
                    else {
                        var r = await interaction.guild.roles.cache.get(value.Role);
                        values.push(`**Role Name:** ${r.name}\n**Role ID:** ${r.id}`);
                    }
                });

                if (values.length > 0) {
                    await sendMessage(`**Mod Roles:**\n\n${values.join('\n')}`);
                } else {
                    await sendMessage('⚠️ There are no mod roles in the database.');
                }
        }      
    }
}
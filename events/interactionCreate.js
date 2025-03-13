const { Interaction } = require("discord.js");
const modrole = require('../schemas/modrole');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return
        
        try{


            await command.execute(interaction, client);
        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: 'There was an error while executing this command!', 
                ephemeral: true
            });
        } 

        // mod role
        if (command.modrole) {
            var modRoleData = await modrole.find({ Guild: interaction.guild.id });
            if (modRoleData.length > 0) {
                var check;
                await modRoleData.forEach(async value => {
                    const mRoles = await interaction.member.roles.cache.map(role => role.id);
                    await mRoles.forEach(async role => {
                        if (role == value.Role) check = true;
                    });
                });

                if (!check) return await interaction.reply({ content:'⚠️ You do not have permission to use this command.', ephemeral: true });

            }
        }
        //

    },
    


};
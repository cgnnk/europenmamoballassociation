const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kicks a specified user from the server',
    execute: async (message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply('You do not have permission to use this command!');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Please mention the user you want to kick!');
        }

        const member = message.guild.members.resolve(user);
        if (!member) {
            return message.reply('This user is not in the server!');
        }

        try {
            await member.kick();
            message.reply(`${user.tag} has been successfully kicked!`);
        } catch (error) {
            console.error(error);
            message.reply('An error occurred while trying to kick the user.');
        }
    }
};
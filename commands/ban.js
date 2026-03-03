const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bans a specified user from the server',
    execute: async (message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('You do not have permission to use this command!');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Please mention the user you want to ban!');
        }

        const member = message.guild.members.resolve(user);
        if (!member) {
            return message.reply('This user is not in the server!');
        }

        try {
            await member.ban();
            message.reply(`${user.tag} has been successfully banned!`);
        } catch (error) {
            console.error(error);
            message.reply('An error occurred while trying to ban the user.');
        }
    }
};
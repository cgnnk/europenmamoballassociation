const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'unmute',
    description: 'Unmutes a specified user',
    execute: async (message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            return message.reply('You do not have permission to use this command!');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Please mention the user whose mute will be removed!');
        }

        const member = message.guild.members.resolve(user);
        if (!member) {
            return message.reply('This user is not in the server!');
        }

        try {
            await member.timeout(null);
            message.reply(`${user.tag}'s mute has been removed!`);
        } catch (error) {
            console.error(error);
            message.reply('An error occurred while trying to unmute the user.');
        }
    }
};
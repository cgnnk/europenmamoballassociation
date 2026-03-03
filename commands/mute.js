const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'mute',
    description: 'Mutes a specified user for a certain period',
    execute: async (message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            return message.reply('You do not have permission to use this command!');
        }

        if (args.length < 2) {
            return message.reply('Please specify the user to mute and the duration!');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Please mention the user you want to mute!');
        }

        const member = message.guild.members.resolve(user);
        if (!member) {
            return message.reply('This user is not in the server!');
        }

        // Simple time parsing (minutes, hours, days, weeks, months)
        const timeString = args[1];
        const timeValue = parseInt(timeString.match(/\d+/)?.[0]) || 1;
        const timeUnit = timeString.match(/[a-zA-Z]+/)?.[0]?.toLowerCase();

        let timeMs;
        switch (timeUnit) {
            case 'minute':
                timeMs = timeValue * 60 * 1000;
                break;
            case 'hour':
                timeMs = timeValue * 60 * 60 * 1000;
                break;
            case 'day':
                timeMs = timeValue * 24 * 60 * 60 * 1000;
                break;
            case 'week':
                timeMs = timeValue * 7 * 24 * 60 * 60 * 1000;
                break;
            case 'month':
                timeMs = timeValue * 30 * 24 * 60 * 60 * 1000;
                break;
            default:
                return message.reply('Invalid time unit! (minute, hour, day, week, month)');
        }

        try {
            await member.timeout(timeMs);
            message.reply(`${user.tag} has been muted for ${timeValue} ${timeUnit}!`);
        } catch (error) {
            console.error(error);
            message.reply('An error occurred while trying to mute the user.');
        }
    }
};
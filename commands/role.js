const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'role',
    description: 'Manage roles for users',
    execute: async (message, args) => {
        if (args.length < 2) {
            return message.reply('Please specify an action and a role! (e.g., /role add [@Role] [@User1 @User2], /role all [@Role])');
        }

        const action = args[0];
        
        if (action === 'add') {
            if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                return message.reply('You do not have permission to use this command!');
            }

            const roleName = args[1];
            const mentionedUsers = message.mentions.users;

            if (mentionedUsers.size === 0) {
                return message.reply('Please tag the users you want to give the role to!');
            }

            const role = message.guild.roles.cache.find(r => r.name === roleName || r.id === roleName.replace(/[<@&>]/g, ''));
            if (!role) {
                return message.reply('The specified role could not be found!');
            }

            for (const user of mentionedUsers.values()) {
                const member = message.guild.members.resolve(user);
                if (member) {
                    try {
                        await member.roles.add(role);
                    } catch (error) {
                        console.error(`Error adding role to ${user.tag}:`, error);
                    }
                }
            }

            message.reply(`${role.name} role was successfully given to the specified users!`);
        } else if (action === 'all') {
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return message.reply('You do not have permission to use this command! (Administrator only)');
            }

            const roleName = args[1];
            const role = message.guild.roles.cache.find(r => r.name === roleName || r.id === roleName.replace(/[<@&>]/g, ''));
            if (!role) {
                return message.reply('The specified role could not be found!');
            }

            const members = message.guild.members.cache.filter(member => !member.user.bot);
            let successCount = 0;
            let failCount = 0;

            for (const member of members.values()) {
                if (!member.roles.cache.has(role.id)) {
                    try {
                        await member.roles.add(role);
                        successCount++;
                    } catch (error) {
                        console.error(`Error adding role to ${member.user.tag}:`, error);
                        failCount++;
                    }
                }
            }

            message.reply(`${role.name} role was successfully given to ${successCount} members. ${failCount} members could not receive the role.`);
        } else {
            message.reply('Invalid action! Use "add" to add a role to specific users or "all" to give a role to all members.');
        }
    }
};
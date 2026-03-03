const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'deletemessage',
    description: 'Deletes a specified number of messages',
    execute: async (message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('You do not have permission to use this command!');
        }

        if (args.length !== 1) {
            return message.reply('Please specify the number of messages to delete (maximum 200)');
        }

        const deleteCount = parseInt(args[0]);
        if (isNaN(deleteCount) || deleteCount <= 0 || deleteCount > 200) {
            return message.reply('Please enter a number between 1 and 200');
        }

        try {
            const messages = await message.channel.messages.fetch({ limit: deleteCount });
            await message.channel.bulkDelete(messages);
            const confirmMessage = await message.reply(`${deleteCount} messages deleted.`);
            setTimeout(() => confirmMessage.delete(), 3000); // Delete confirmation message after 3 seconds
        } catch (error) {
            console.error(error);
            message.reply('An error occurred while trying to delete the messages.');
        }
    }
};
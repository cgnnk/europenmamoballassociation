const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Shows the list of available commands',
    execute: async (message, args) => {
        const helpEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Mamoball Bot Commands')
            .addFields(
                { name: '/ban [@User]', value: 'Bans the specified user from the server' },
                { name: '/kick [@User]', value: 'Kicks the specified user from the server' },
                { name: '/server', value: 'Shows server information' },
                { name: '/deletemessage [Number(Max 200)]', value: 'Deletes the specified number of messages' },
                { name: '/role add [@Role] [@User1 @User2]', value: 'Adds members to the specified role' },
                { name: '/role all [@Role]', value: 'Gives the specified role to all members in the server' },
                { name: '/mute [@User] [Duration]', value: 'Mutes the specified user' },
                { name: '/unmute [@User]', value: 'Removes mute from the specified user' },
                { name: '/member [@User]', value: 'Provides information about the member' },
                { name: '/avatar [@User]', value: 'Shows the user\'s avatar' }
            );
        message.reply({ embeds: [helpEmbed] });
    }
};
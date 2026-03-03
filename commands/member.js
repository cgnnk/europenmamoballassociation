const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'member',
    description: 'Shows information about a specified user',
    execute: async (message, args) => {
        const user = message.mentions.users.first() || message.author;

        const member = message.guild.members.resolve(user);
        if (!member) {
            return message.reply('This user is not in the server!');
        }

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${user.tag} Information`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: 'Account Creation Date', value: user.createdAt.toLocaleDateString('en-US'), inline: true },
                { name: 'Join Date to Server', value: member.joinedAt.toLocaleDateString('en-US'), inline: true },
                { name: 'User ID', value: user.id, inline: true }
            );

        message.reply({ embeds: [embed] });
    }
};
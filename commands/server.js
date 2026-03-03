const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'server',
    description: 'Shows information about the server',
    execute: async (message, args) => {
        const guild = message.guild;
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(guild.name)
            .addFields(
                { name: 'Server Name', value: guild.name, inline: true },
                { name: 'Server Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Total Members', value: guild.memberCount.toString(), inline: true },
                { name: 'Active Members', value: guild.presences.cache.size.toString(), inline: true },
                { name: 'Creation Date', value: guild.createdAt.toLocaleDateString('en-US'), inline: true }
            );

        message.reply({ embeds: [embed] });
    }
};
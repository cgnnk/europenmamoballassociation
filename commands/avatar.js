const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'avatar',
    description: 'Shows the avatar of a specified user',
    execute: async (message, args) => {
        const user = message.mentions.users.first() || message.author;
        const size = args.includes('pixel') ? 16 : 512; // If 'pixel' is included, use small image
        
        const avatarURL = user.displayAvatarURL({ dynamic: true, size: size });
        
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${user.tag}'s Avatar`)
            .setImage(avatarURL)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
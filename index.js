const { Client, GatewayIntentBits, PermissionsBitField, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildMessages, 
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent
	] 
});

client.once('ready', () => {
	console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
});

// Yardım komutu
client.on('messageCreate', async (message) => {
	if (message.content === '/help') {
		const helpEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Mamoball Bot Komutları')
			.addFields(
				{ name: '/ban [@Üye]', value: 'Belirtilen üyeyi sunucudan yasaklar' },
				{ name: '/kick [@Üye]', value: 'Belirtilen üyeyi sunucudan atar' },
				{ name: '/server', value: 'Sunucu bilgilerini gösterir' },
				{ name: '/delete message [Sayı(Maksimum 200)]', value: 'Belirtilen sayıda mesajı siler' },
				{ name: '/role add [@Rol] [@Üye1 @Üye2]', value: 'Belirtilen role üyeleri ekler' },
				{ name: '/role all [@Rol]', value: 'Sunucudaki tüm üyelere belirtilen rolü verir' },
				{ name: '/mute [@Üye] [Süre]', value: 'Belirtilen üyeyi susturur' },
				{ name: '/unmute [@Üye]', value: 'Belirtilen üyenin susturmasını kaldırır' },
				{ name: '/member [@Üye]', value: 'Üye hakkında bilgi verir' },
				{ name: '/avatar [@Üye]', value: 'Üyenin avatarını gösterir' }
			);
		message.reply({ embeds: [helpEmbed] });
	}
});

// Ban komutu
client.on('messageCreate', async (message) => {
	if (message.content.startsWith('/ban')) {
		if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
			return message.reply('Bu komutu kullanma yetkiniz yok!');
		}

		const user = message.mentions.users.first();
		if (!user) {
			return message.reply('Lütfen yasaklamak istediğiniz kullanıcıyı etiketleyin!');
		}

		const member = message.guild.members.resolve(user);
		if (!member) {
			return message.reply('Bu kullanıcı sunucuda değil!');
		}

		try {
			await member.ban();
			message.reply(`${user.tag} başarıyla yasaklandı!`);
		} catch (error) {
			console.error(error);
			message.reply('Kullanıcıyı yasaklarken bir hata oluştu.');
		}
	}
});

// Kick komutu
client.on('messageCreate', async (message) => {
	if (message.content.startsWith('/kick')) {
		if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
			return message.reply('Bu komutu kullanma yetkiniz yok!');
		}

		const user = message.mentions.users.first();
		if (!user) {
			return message.reply('Lütfen atmak istediğiniz kullanıcıyı etiketleyin!');
		}

		const member = message.guild.members.resolve(user);
		if (!member) {
			return message.reply('Bu kullanıcı sunucuda değil!');
		}

		try {
			await member.kick();
			message.reply(`${user.tag} başarıyla atıldı!`);
		} catch (error) {
			console.error(error);
			message.reply('Kullanıcıyı atarken bir hata oluştu.');
		}
	}
});

// Server komutu
client.on('messageCreate', async (message) => {
	if (message.content === '/server') {
		const guild = message.guild;
		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle(guild.name)
			.addFields(
				{ name: 'Sunucu Adı', value: guild.name, inline: true },
				{ name: 'Sunucu Sahibi', value: `<@${guild.ownerId}>`, inline: true },
				{ name: 'Toplam Üye Sayısı', value: guild.memberCount.toString(), inline: true },
				{ name: 'Aktif Üye Sayısı', value: guild.presences.cache.size.toString(), inline: true },
				{ name: 'Oluşturulma Tarihi', value: guild.createdAt.toLocaleDateString('tr-TR'), inline: true }
			);

		message.reply({ embeds: [embed] });
	}
});

// Delete message komutu
client.on('messageCreate', async (message) => {
	if (message.content.startsWith('/delete message')) {
		if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
			return message.reply('Bu komutu kullanma yetkiniz yok!');
		}

		const args = message.content.split(' ');
		if (args.length !== 3) {
			return message.reply('Lütfen silmek istediğiniz mesaj sayısını belirtin (maksimum 200)');
		}

		const deleteCount = parseInt(args[2]);
		if (isNaN(deleteCount) || deleteCount <= 0 || deleteCount > 200) {
			return message.reply('Lütfen 1 ile 200 arasında bir sayı girin');
		}

		try {
			const messages = await message.channel.messages.fetch({ limit: deleteCount });
			await message.channel.bulkDelete(messages);
			const confirmMessage = await message.reply(`${deleteCount} mesaj silindi.`);
			setTimeout(() => confirmMessage.delete(), 3000); // 3 saniye sonra sil
		} catch (error) {
			console.error(error);
			message.reply('Mesajları silerken bir hata oluştu.');
		}
	}
});

// Role add komutu
client.on('messageCreate', async (message) => {
	if (message.content.startsWith('/role add')) {
		if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			return message.reply('Bu komutu kullanma yetkiniz yok!');
		}

		const args = message.content.slice('/role add'.length).trim().split(' ');
		if (args.length < 2) {
			return message.reply('Lütfen bir rol ve en az bir kullanıcı belirtin!');
		}

		const roleName = args[0];
		const mentionedUsers = message.mentions.users;

		if (mentionedUsers.size === 0) {
			return message.reply('Lütfen rolleri vermek istediğiniz kullanıcıları etiketleyin!');
		}

		const role = message.guild.roles.cache.find(r => r.name === roleName || r.id === roleName.replace(/[<@&>]/g, ''));
		if (!role) {
			return message.reply('Belirtilen rol bulunamadı!');
		}

		for (const user of mentionedUsers.values()) {
			const member = message.guild.members.resolve(user);
			if (member) {
				try {
					await member.roles.add(role);
				} catch (error) {
					console.error(`Rolü ${user.tag}'e eklerken hata:`, error);
				}
			}
		}

		message.reply(`${role.name} rolü belirtilen kullanıcılara başarıyla verildi!`);
	}
});

// Role all komutu
client.on('messageCreate', async (message) => {
	if (message.content.startsWith('/role all')) {
		if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			return message.reply('Bu komutu kullanma yetkiniz yok! (Yalnızca yönetici)');
		}

		const args = message.content.slice('/role all'.length).trim().split(' ');
		if (args.length === 0) {
			return message.reply('Lütfen tüm üyelere verilecek rolü belirtin!');
		}

		const roleName = args[0];
		const role = message.guild.roles.cache.find(r => r.name === roleName || r.id === roleName.replace(/[<@&>]/g, ''));
		if (!role) {
			return message.reply('Belirtilen rol bulunamadı!');
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
					console.error(`Rolü ${member.user.tag}'e eklerken hata:`, error);
					failCount++;
				}
			}
		}

		message.reply(`${role.name} rolü ${successCount} üyeye başarıyla verildi. ${failCount} üyeye verilemedi.`);
	}
});

// Mute komutu
client.on('messageCreate', async (message) => {
	if (message.content.startsWith('/mute')) {
		if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
			return message.reply('Bu komutu kullanma yetkiniz yok!');
		}

		const args = message.content.slice('/mute'.length).trim().split(' ');
		if (args.length < 2) {
			return message.reply('Lütfen susturmak istediğiniz kullanıcıyı ve süreyi belirtin!');
		}

		const user = message.mentions.users.first();
		if (!user) {
			return message.reply('Lütfen susturmak istediğiniz kullanıcıyı etiketleyin!');
		}

		const member = message.guild.members.resolve(user);
		if (!member) {
			return message.reply('Bu kullanıcı sunucuda değil!');
		}

		// Basit süre çözümlemesi (dakika, saat, gün)
		const timeString = args[1];
		const timeValue = parseInt(timeString.match(/\d+/)?.[0]) || 1;
		const timeUnit = timeString.match(/[a-zA-Z]+/)?.[0]?.toLowerCase();

		let timeMs;
		switch (timeUnit) {
			case 'dakika':
			case 'minute':
				timeMs = timeValue * 60 * 1000;
				break;
			case 'saat':
			case 'hour':
				timeMs = timeValue * 60 * 60 * 1000;
				break;
			case 'gün':
			case 'day':
				timeMs = timeValue * 24 * 60 * 60 * 1000;
				break;
			case 'hafta':
			case 'week':
				timeMs = timeValue * 7 * 24 * 60 * 60 * 1000;
				break;
			case 'ay':
			case 'month':
				timeMs = timeValue * 30 * 24 * 60 * 60 * 1000;
				break;
			default:
				return message.reply('Geçersiz zaman birimi! (dakika, saat, gün, hafta, ay)');
		}

		try {
			await member.timeout(timeMs);
			message.reply(`${user.tag} ${timeValue} ${timeUnit} boyunca susturuldu!`);
		} catch (error) {
			console.error(error);
			message.reply('Kullanıcıyı sustururken bir hata oluştu.');
		}
	}
});

// Unmute komutu
client.on('messageCreate', async (message) => {
	if (message.content.startsWith('/unmute')) {
		if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
			return message.reply('Bu komutu kullanma yetkiniz yok!');
		}

		const user = message.mentions.users.first();
		if (!user) {
			return message.reply('Lütfen susturması kaldırılacak kullanıcıyı etiketleyin!');
		}

		const member = message.guild.members.resolve(user);
		if (!member) {
			return message.reply('Bu kullanıcı sunucuda değil!');
		}

		try {
			await member.timeout(null);
			message.reply(`${user.tag} kullanıcısının susturulması kaldırıldı!`);
		} catch (error) {
			console.error(error);
			message.reply('Kullanıcının susturulmasını kaldırırken bir hata oluştu.');
		}
	}
});

// Member komutu
client.on('messageCreate', async (message) => {
	if (message.content.startsWith('/member')) {
		const user = message.mentions.users.first() || message.author;

		const member = message.guild.members.resolve(user);
		if (!member) {
			return message.reply('Bu kullanıcı sunucuda değil!');
		}

		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle(`${user.tag} Hakkında Bilgiler`)
			.setThumbnail(user.displayAvatarURL())
			.addFields(
				{ name: 'Hesap Oluşturma Tarihi', value: user.createdAt.toLocaleDateString('tr-TR'), inline: true },
				{ name: 'Sunucuya Katılma Tarihi', value: member.joinedAt.toLocaleDateString('tr-TR'), inline: true },
				{ name: 'Kullanıcı ID', value: user.id, inline: true }
			);

		message.reply({ embeds: [embed] });
	}
});

// Avatar komutu
client.on('messageCreate', async (message) => {
	if (message.content.startsWith('/avatar')) {
		const user = message.mentions.users.first() || message.author;
		const size = message.content.includes('pixel') ? 16 : 512; // Eğer pixel yazıyorsa küçük resim
		
		const avatarURL = user.displayAvatarURL({ dynamic: true, size: size });
		
		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle(`${user.tag} Kullanıcısının Avatarı`)
			.setImage(avatarURL)
			.setTimestamp();

		message.reply({ embeds: [embed] });
	}
});

client.login(process.env.DISCORD_TOKEN);
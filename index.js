const { Client, GatewayIntentBits } = require('discord.js');
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
	console.log(`Bot ${client.user.tag} is ready!`);
});

// Load commands from the commands folder
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const commands = {};
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands[command.name] = command;
}

// Handle commands
client.on('messageCreate', async (message) => {
	if (message.author.bot) return;
	if (!message.content.startsWith('/')) return;

	const args = message.content.slice(1).trim().split(' ');
	const commandName = args.shift().toLowerCase();

	if (commands[commandName]) {
		try {
			commands[commandName].execute(message, args);
		} catch (error) {
			console.error(error);
			message.reply('There was an error executing the command.');
		}
	}
});

client.login(process.env.DISCORD_TOKEN);
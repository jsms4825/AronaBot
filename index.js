const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection, Attachmen, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
const { diffieHellman } = require('node:crypto');
require('dotenv').config();

const config = {
	token: process.env.token
}

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Button Event

client.on(Events.InteractionCreate, async interaction => {
	if(!interaction.isButton() && !interaction.isStringSelectMenu()) return;
 
	const buttonID = interaction.customId;

	if(buttonID == 'currentBoss' || buttonID == 'selectBoss') {
		
		selectedBoss = '';
		if(buttonID == 'currentBoss') {
			selectedBoss = require('./TotalAssault/currentAssault.json').CURRENTBOSS;
		} else if(buttonID == 'selectBoss') {
			selectedBoss = interaction.values[0];
		}
		const assaultInfo = require('./TotalAssault/datas/bossList.json');

		for(const boss of assaultInfo) {
			if(boss.name == selectedBoss) {

				let difficultyInfo = "```ini\n";
				for(const difficulty of boss.difficulty)
					difficultyInfo += `[ ${difficulty.diff} ] \t\t HP: ${difficulty.hp} \t | 공격타입: ${difficulty.attackType}\n`;
				difficultyInfo += "```";

				await interaction.reply({
					files: [{ attachment: `./TotalAssault/Images/${boss.name}.jpeg` }],
					content: `총력전 보스: ${boss.name}\n` +
					`방어타입: ${boss.property}\n\n` +
					`${difficultyInfo}\n` +
					`${boss.description}`
				});
			}
		}
	} else if(buttonID == 'otherBoss') {
		const selectBoss = new StringSelectMenuBuilder()
			.setCustomId('selectBoss')

		const assaultInfo = require('./TotalAssault/datas/bossList.json');

		for(const boss of assaultInfo) {
			selectBoss.addOptions(new StringSelectMenuOptionBuilder()
				.setLabel(boss.name)
				.setValue(boss.name)
				.setDescription(`${boss.name}에 대한 내용을 확인합니다.`)
			);
		}
			/*
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('고즈(실내)')
					.setDescription('고즈(실내전)에 대한 내용을 확인합니다.')
					.setValue('고즈(실내)'),
				new StringSelectMenuOptionBuilder()
					.setLabel('고즈(야전)')
					.setDescription('고즈(야전)에 대한 내용을 확인합니다.')
					.setValue('고즈(야전)'),
				new StringSelectMenuOptionBuilder()
					.setLabel('시로&쿠로(실내)')
					.setDescription('시로쿠로(실내전)에 대한 내용을 확인합니다.')
					.setValue('시로쿠로(실내)'),
				new StringSelectMenuOptionBuilder()
					.setLabel('시로&쿠로(시가전)')
					.setDescription('시로쿠로(시가전)에 대한 내용을 확인합니다.')
					.setValue('시로쿠로(시가전)'),
				new StringSelectMenuOptionBuilder()
					.setLabel('비나(시가전)')
					.setDescription('고즈(시가전)에 대한 내용을 확인합니다.')
					.setValue('비나(시가전)'),
				new StringSelectMenuOptionBuilder()
					.setLabel('비나(야전)')
					.setDescription('비나(야전)에 대한 내용을 확인합니다.')
					.setValue('비나(야전)')
			);
			*/
        
        const row = new ActionRowBuilder()
			.addComponents(selectBoss);

		await interaction.reply({
			content: '선생님, 확인하실 총력전 보스를 선택해주세요!',
			components: [row],
        });
	}
});

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(config.token);
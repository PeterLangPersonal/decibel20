import { Client, GatewayIntentBits, Partials, Collection, ActivityType } from "discord.js";
import { handleAvraeMessage } from "./services";
import path from 'node:path';
import fs from 'node:fs';
import { Player } from "discord-player";
import { sequelize } from "./db";
import { ClientWithCommands } from "./interfaces";

// Initialize dotenv
require('dotenv').config();

// Initialize DB
sequelize.sync().then(() => console.log('db is ready'));

// Discord.js versions ^13.0 require us to explicitly define client intents
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates], partials: [Partials.Channel] }) as ClientWithCommands;

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => !file.startsWith('index'));

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

client.player = new Player(client, {
	ytdlOptions: {
		quality: "highestaudio",
		highWaterMark: 1 << 25,
	}
});

client.player.extractors.loadDefault();

client.on('ready', () => {
	console.log(`Logged in as ${client.user?.tag}!`);
	client.user?.setPresence({ 
		activities: [{ 
			name: ' music for your D&D games', 
			type: ActivityType.Playing, 
		}], 
		status: 'online' 
	});
});

// Log In our bot
client.login(process.env.CLIENT_TOKEN);

client.on('messageCreate', msg => {
    const authorId = msg.author.id;
    if (authorId === '261302296103747584' || authorId === '265954408829812736') {
      handleAvraeMessage({msg, client});
    }
});

client.on('interactionCreate', async interaction => {
	if (interaction.isChatInputCommand()) {	
		const command = (interaction.client as ClientWithCommands).commands.get(interaction.commandName);
  
	  if (!command) {
		  console.error(`No command matching ${interaction.commandName} was found.`);
		  return;
	  }
  
	  try {
		  await command.execute(interaction, client);
	  } catch (error) {
		  console.error(error);
		  if (interaction.replied || interaction.deferred) {
			  await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		  } else {
			  await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		  }
	  }
	} else if (interaction.isAutocomplete()) {
		const command = (interaction.client as ClientWithCommands).commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.autocomplete(interaction);
		} catch (error) {
			console.error(error);
		}
	}
});

import { getVoiceConnection } from "@discordjs/voice";
import { BaseGuildVoiceChannel, ChannelType, SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('exit')
		.setDescription('Exit voice channel'),
	async execute(interaction: any, client: any) {
		if (client.voice.adapters.size > 0) {
			getVoiceConnection(interaction.guild.id)?.destroy();
			await interaction.reply('Left channel');

		} else {
			await interaction.reply('Not in a voice channel');
		}
	},
};

import { getVoiceConnection } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('exit')
		.setDescription('Exit voice channel'),
	async execute(interaction: any) {
		await interaction.reply('Left channel');
		const voice_channel = interaction.member.voice.channel;
        if (voice_channel.guild.id) {
            getVoiceConnection(voice_channel.guild.id)?.disconnect();
        }
	},
};
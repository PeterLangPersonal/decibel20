import { joinVoiceChannel } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Joins voice channel'),
	async execute(interaction: any) {
		await interaction.reply('Joined channel');
		const voice_channel = interaction.member.voice.channel;
		joinVoiceChannel({
            channelId: voice_channel.id,
            guildId: voice_channel.guild.id,
            adapterCreator: voice_channel.guild.voiceAdapterCreator
        })
	},
};
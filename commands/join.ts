import { joinVoiceChannel } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Joins voice channel'),
	async execute(interaction: any, client: any) {
		const voice_channel = interaction.member.voice.channel;

		if (!voice_channel) {
			await interaction.reply("You must be in a voice channel to use this command");
			return;
		}

		await interaction.reply('Joined channel');

		joinVoiceChannel({
            channelId: voice_channel.id,
            guildId: voice_channel.guild.id,
            adapterCreator: voice_channel.guild.voiceAdapterCreator
        });

		const queue = client.player.nodes.create(interaction.guild, {
			leaveOnEmpty: false,
			leaveOnStop: false,
			leaveOnEnd: false,
		});
		
        if (!queue.connection) await queue.connect(voice_channel);
	},
};
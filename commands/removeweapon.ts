import { SlashCommandBuilder } from "discord.js";
import { Weapon } from "../db";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removeweapon')
		.setDescription('Remove a weapon')
        .addStringOption(option => option.setName('name')
            .setDescription('The name of the weapon you wish to remove')
            .setMaxLength(50)
            .setRequired(true)
            .setAutocomplete(true)
        ),
    async autocomplete(interaction: any) {
        const focusedValue = interaction.options.getFocused();
		const weapons = await Weapon.findAll({limit: 25});
        const choices = weapons.map((weapon: Weapon) =>weapon.name)
		const filtered = choices.filter((choice: string) => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map((choice: any) => ({ name: choice, value: choice })),
		);
    },
	async execute(interaction: any) {
		const name = await interaction.options.getString('name');

		const weapon = await Weapon.findOne({
			where: {
				name,
			}
		});

		if (!weapon) await interaction.reply(`Weapon ${name} is not recognized`);
		else {
			try {
				await weapon.destroy();
				await interaction.reply(`Weapon ${name} has been removed`);
			} catch(error) {
				console.error(error);
				await interaction.reply('Something went wrong');
			}
		}
	},
};
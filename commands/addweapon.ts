import { SlashCommandBuilder } from "discord.js";
import { Weapon } from "../db";
import { DamageTypes } from "../const";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addweapon')
		.setDescription('Add a new weapon')
        .addStringOption(option => option.setName('name')
			.setDescription('The name of the weapon you wish to add')
			.setMaxLength(50).setRequired(true)
		)
        .addStringOption(option => option.setName('damage-type')
			.setDescription('The name of the damage type you wish to add')
			.addChoices(
				{name: DamageTypes.slashing, value: DamageTypes.slashing},
				{name: DamageTypes.piercing, value: DamageTypes.piercing},
				{name: DamageTypes.bludgeoning, value: DamageTypes.bludgeoning},
				{name: DamageTypes.fire, value: DamageTypes.fire},
				{name: DamageTypes.acid, value: DamageTypes.acid},
				{name: DamageTypes.cold, value: DamageTypes.cold},
				{name: DamageTypes.force, value: DamageTypes.force},
				{name: DamageTypes.lightning, value: DamageTypes.lightning},
				{name: DamageTypes.necrotic, value: DamageTypes.necrotic},
				{name: DamageTypes.poison, value: DamageTypes.poison},
				{name: DamageTypes.psychic, value: DamageTypes.psychic},
				{name: DamageTypes.radiant, value: DamageTypes.radiant},
				{name: DamageTypes.thunder, value: DamageTypes.thunder},
				{name: DamageTypes.healing, value: DamageTypes.healing}
			)
			.setMaxLength(25)
			.setRequired(true)
		)
		.addBooleanOption(option => option.setName('ranged')
			.setDescription('If this is a ranged weapon or not')
			.setRequired(true)
		),
	async execute(interaction: any) {
		const name = await interaction.options.getString('name').toLowerCase();
		const damageType = await interaction.options.getString('damage-type');
		const ranged = await interaction.options.getBoolean('ranged');

		const weapon = await Weapon.findOne({
			where: {
				name,
			}
		});

		if (weapon) await interaction.reply(`Weapon ${name} has already been added`);
		else {
			try {
				await Weapon.create({
					name,
					damageType,
					ranged,
				});
				await interaction.reply(`Weapon ${name} has been added`);
			} catch(error) {
				console.error(error);
				await interaction.reply('Something went wrong');
			}
		}
	},
};
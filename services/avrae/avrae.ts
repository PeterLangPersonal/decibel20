import { Message } from "discord.js";
import { ClientWithCommands } from "../../interfaces";
import { GuildQueue, QueryType } from "discord-player";
import { Weapon } from "../../db";
import { Op } from "sequelize";
import { DamageTypes } from "../../const";

type HandleAvraeMessage = {
    msg: Message<boolean>;
    client: ClientWithCommands;
};

export const handleAvraeMessage = async ({
    msg,
    client,
}: HandleAvraeMessage) => {
    if (client.voice.adapters.size > 0 && msg.guild) {
        const queue = client.player.nodes.get(msg.guild);
        if (!queue) return;

        let name;
        if (msg.embeds.length > 0 && msg.embeds[0].title 
            && (msg.embeds[0].title.includes('attacks with') 
                || msg.embeds[0].title.includes('heals with') 
                || msg.embeds[0].title.includes('casts'))) {
            name = msg.embeds[0].title;

            let start = 0;
            let len = 0;
            if (name.includes('attacks with')) {
                start = name.indexOf('attacks with') + 1;
                len = 'attacks with'.length;
            } else if (name.includes('heals with')) {
                start = name.indexOf('heals with') + 1;
                len = 'heals with'.length;
            } else if (name.includes('casts')) {
                start = name.indexOf('casts') + 1;
                len = 'casts'.length;
            } else {
                return;
            }

            name = name.substring(start + len).toLowerCase().replace(/[^\w\s]/gi, '');
            if (name.substring(0, 2) === 'a ') {
                name = name.substring(2);
            } else if (name.substring(0, 3) === 'an ') {
                name = name.substring(3);
            }
        } else {
            return;
        }

        let weapon = await Weapon.findOne({
            where: {
                name: name.toLowerCase(),
            }
        });

        if (!weapon) {
            const query = name.split(' ').map((word) => {
                return {
                    name: {
                        [Op.like]: `%${word.toLowerCase().replace(/[^\w\s]/gi, '')}%`,
                    },
                };
            });
    
            weapon = await Weapon.findOne({
                where: {
                    [Op.or]: query
                }
            });
        }

        console.log(weapon);

        if (weapon) {
            if (weapon.damageType === DamageTypes.slashing && !weapon.ranged) {
                await playClip("https://youtu.be/vT-qZZSaHPE", client, queue);
            } else if (weapon.damageType === DamageTypes.piercing && weapon.ranged) {
                await playClip("https://youtu.be/fm3963W8x2I", client, queue);
            } else if (weapon.damageType === DamageTypes.bludgeoning && !weapon.ranged) {
                await playClip("https://youtu.be/shcx5sk2NMY", client, queue);
            } else if (weapon.damageType === DamageTypes.fire) {
                await playClip("https://www.youtube.com/watch?v=hY2W_ZOY9P4", client, queue);
            } else if (weapon.damageType === DamageTypes.acid) {
                await playClip("https://youtu.be/fdPbPAEkxv0", client, queue);
            } else if (weapon.damageType === DamageTypes.cold) {
                await playClip("https://www.youtube.com/watch?v=wjQSYMQG_1o", client, queue);
            } else if (weapon.damageType === DamageTypes.force) {
                await playClip("https://youtu.be/h1w66nWfa4I", client, queue);
            } else if (weapon.damageType === DamageTypes.lightning) {
                await playClip("https://youtu.be/HoGCY1f-pOI    ", client, queue);
            } else if (weapon.damageType === DamageTypes.necrotic) {
                await playClip("https://youtu.be/FkiuuQvMs2A", client, queue);
            } else if (weapon.damageType === DamageTypes.poison) {
                await playClip("https://youtu.be/fdPbPAEkxv0", client, queue);
            } else if (weapon.damageType === DamageTypes.psychic) {
                await playClip("https://youtu.be/G_SODMBzgCI", client, queue);
            } else if (weapon.damageType === DamageTypes.radiant) {
                await playClip("https://www.youtube.com/watch?v=atuWyzvkDY8", client, queue);
            } else if (weapon.damageType === DamageTypes.thunder) {
                await playClip("https://www.youtube.com/watch?v=frtC6uLgy_U", client, queue);
            } else if (weapon.damageType === DamageTypes.healing) {
                await playClip("https://www.youtube.com/watch?v=bx1uBteRryE", client, queue);
            } else {
                await playClip("https://www.youtube.com/watch?v=OLJbtULNOaM", client, queue);
            }
        } else {
            await playClip("https://www.youtube.com/watch?v=OLJbtULNOaM", client, queue);
        }
    }

    return;
}

const playClip = async (url: string, client: ClientWithCommands, queue: GuildQueue<unknown>) => {
    const result = await client.player.search(url, {
        searchEngine: QueryType.YOUTUBE_VIDEO,
    });

    const song = result.tracks[0];
    queue.play(song);

    return;
}
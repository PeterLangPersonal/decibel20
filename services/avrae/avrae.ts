import { Message } from "discord.js";

export const handleAvraeMessage = (msg: Message<boolean>) => {
    console.log(msg.content);
    const content = msg.content;
    if (content.includes('sword')) {
        msg.reply("Sword attack!");
    } else if (content.includes('bow')) {
        msg.reply("Bow attack!");
    }
}
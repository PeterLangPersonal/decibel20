import { Player } from "discord-player"
import { Client, Collection } from "discord.js"

export interface ClientWithCommands extends Client {
    commands: Collection<string, any>
    player: Player
};
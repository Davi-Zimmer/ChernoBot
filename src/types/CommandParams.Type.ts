import { Client, Message } from "discord.js";

export interface CommandParams {

    message: Message

    args: string[]
    
    client: Client 
}
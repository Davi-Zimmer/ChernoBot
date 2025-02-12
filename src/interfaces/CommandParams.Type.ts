import { Client, Message } from "discord.js";
import ChernoBot from "../main/Main.js";

export default interface CommandParams {

    message: Message

    args: string[]
    
    client: Client 

    chernoBot: ChernoBot
}
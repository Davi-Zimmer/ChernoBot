import { Message } from "discord.js"

export default interface CommandType {

    name: string

    execute: ( message:Message, args?: string[]  ) => void
    
}
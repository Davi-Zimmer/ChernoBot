import { Message } from "discord.js";

const newCommand = ( name:string, execute: ( message:Message ) => void ) => {
    return { 
        name,
        execute
    }
}

export default newCommand
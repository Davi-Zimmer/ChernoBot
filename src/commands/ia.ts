import { Message } from "discord.js"
import newCommand from "../utils/newCommand"

const ia = newCommand("ia", ( message : Message ) => {

    message.reply('ola!')
    
})

export default ia
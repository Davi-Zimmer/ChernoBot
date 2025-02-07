import { EndBehaviorType } from "@discordjs/voice";
import CommandParams from "../types/CommandParams.Type";
import newCommand from "../utils/newCommand";
import fs from 'fs'


const Test = newCommand('test', ( { client, chernoBot, message, args } : CommandParams ) => {
    
    message.reply('Test?')
    
})


export default Test
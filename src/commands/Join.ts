import CommandParams from "../interfaces/CommandParams.Type";
import createCommand from "../utils/CreateCommand";

import getForeGoundColors from "../classes/ForegroundColors";
import { PermissionFlagsBits, PermissionsBitField } from "discord.js";
const fgc = getForeGoundColors()

const Join = createCommand({
    name:'join', execute: async ( { message, args, chernoBot } : CommandParams) => {
    
        const member = message.member
    
        if( !member ) return
    
        const channelId = member?.voice.channel?.id ?? args.shift()
    
        if( !channelId ){
    
            message.reply('Entre ou forneça um id de uma call.')
    
            return
        }
         
        await chernoBot.joinInVoiceChannel( channelId )
        
    },
    description: fgc.Cyan('Entra na call.')
})

export default Join
import CommandParams from "../interfaces/CommandParams.Type";
import createCommand from "../utils/CreateCommand";

const Join = createCommand({
    name:'join', execute: async ( { message, args,  chernoBot } : CommandParams) => {
    
        const member = message.member
    
        if(!member) return
    
        const channelId = member?.voice.channel?.id ?? args.shift()
    
        if( !channelId ){
    
            message.reply('Entre ou forneça um id de uma call.')
    
            return
        }
         
        chernoBot.joinInVoiceChannel( channelId )
        
    }
})

export default Join
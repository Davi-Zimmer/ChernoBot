import { joinVoiceChannel } from "@discordjs/voice";
import CommandParams from "../types/CommandParams.Type";
import newCommand from "../utils/newCommand";

const Enter = newCommand('enter', async ( { message, args, client, chernoBot } : CommandParams) => {
    
    const member = message.member

    if(!member) return

    const channelId = member?.voice.channel?.id ?? args.shift()

    if( !channelId ){

        message.reply('Entre ou forneça um id de uma call.')

        return
    }

    
    chernoBot.joinInVoiceChannel( channelId )
    
})

export default Enter
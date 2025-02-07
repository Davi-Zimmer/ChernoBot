import CommandParams from "../types/CommandParams.Type";
import newCommand from "../utils/newCommand";
import { accessDenied, isOwner } from "../utils/Security";

const Move = newCommand('move', async ( { message, args, client } : CommandParams) => {

    if( !isOwner( message ) ) {

        accessDenied( message )

        return
    }

    const originChannelId = args.shift()

    const destinyChannelId = args.shift()

    if( !originChannelId || !destinyChannelId ){
        
        message.reply('Informe os canais de origem e destino.')
        
        return
    }

    try {
        const fromChannel = await client.channels.fetch( originChannelId )
        
        const toChannel = await client.channels.fetch( destinyChannelId )

        if( !fromChannel || !toChannel || !fromChannel.isVoiceBased() || !toChannel.isVoiceBased() ) {
            
            message.reply('Não foi possível ideentificar o canal.')
            
            return
        }
       
        fromChannel.members.forEach( async guildMember => {

            await guildMember.voice.setChannel( toChannel )

        })
        

    } catch {}


})

export default Move
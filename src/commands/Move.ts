import CommandParams from "../interfaces/CommandParams.Type";
import createCommand from "../utils/CreateCommand";
import { accessDenied, isOwner } from "../utils/Security";

import getForeGoundColors from "../classes/ForegroundColors";
import { PermissionsBitField } from "discord.js";
const fgc = getForeGoundColors()

const Move = createCommand({
    name:'move',
    execute: async ( { message, args, client } : CommandParams) => {

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
    
    
    },

    description: fgc.Cyan('Move todos os usuários de uma call pra outra.'),

    options: {
        permissions: [
            PermissionsBitField.Flags.MoveMembers
        ]
    }
})

export default Move
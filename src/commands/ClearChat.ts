import CommandParams from "../interfaces/CommandParams.Type"
import createCommand from "../utils/CreateCommand"

import getForeGoundColors from "../classes/ForegroundColors"
import { PermissionsBitField } from "discord.js"
const fgc = getForeGoundColors()

const ClearChat = createCommand({
    name:"clearChat",
    execute: async ( { message, args } : CommandParams ) => {

        const n = args.shift()

        const quantity = Number( n )

        if( isNaN( quantity )){

            message.reply('Informe quantas mensagens vão ser apagadas.')
            
            return

        }

        message.delete()
        
        const channel = message.channel

        if( !channel.isTextBased() || channel.isDMBased() ) return

        await channel.bulkDelete( quantity, true)
        .catch(err => console.log('Erro ao apagar mensagens:', err));

        
        /*
        const fetched = await message.channel.messages.fetch({ limit: 100 })

        fetched.forEach(msg => {

            if (msg.createdTimestamp < Date.now() - 1209600000) { // 14 dias em milissegundos

                msg.delete().catch(err => console.error('Erro ao apagar mensagem antiga:', err))
            
            }

        })
        */
    },

    description: fgc.Cyan('Limpa o chat.'),

    options: {
        // permission: 
        permissions: [
            PermissionsBitField.Flags.ManageMessages
        ]
    }

})

export default ClearChat
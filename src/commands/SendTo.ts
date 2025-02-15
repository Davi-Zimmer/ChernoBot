import CommandParams from "../interfaces/CommandParams.Type";
import createCommand from "../utils/CreateCommand";

import { accessDenied, isOwner } from "../utils/Security";

const DmMessage = createCommand({
    name:'sendTo',
    execute: async ( { message, args, client } : CommandParams ) => {
    
        if( !isOwner( message ) ) {

            accessDenied( message )

            return
        }

        const targetUserId = args.shift()

        if( !targetUserId ){

            message.reply('Informe o id do usuaário e a mensagem a ser envida.')

            return
        }

        client.users.fetch( targetUserId )

        .then( user => {

            user.send( args.join(' ') )
            
            message.reply('Mensagem enviada.')
        })

        .catch( ex => {
            
            console.log( ex )

            message.reply("Houve um erro ao enviar a mensagem.")
        
        })

    }
})

export default DmMessage
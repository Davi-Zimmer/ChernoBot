import CommandParams from "../interfaces/CommandParams.Type";
import createCommand from "../utils/CreateCommand";

import getForeGoundColors from "../classes/ForegroundColors";
const fgc = getForeGoundColors()

const Speak = createCommand({
    name: 'speak',
    execute: async ({ message, chernoBot, args } : CommandParams ) => {

        const feedback = await chernoBot.speak( args )
       
        if( feedback.onError ){

            message.reply( `Erro: ${ feedback.message }` )

            return
        }
    
    },

    description: fgc.Cyan('Lê a mensagem enviada.')
})


export default Speak
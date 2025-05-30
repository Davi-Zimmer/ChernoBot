import CommandParams from "../../interfaces/CommandParams.Type";
import createCommand from "../../utils/CreateCommand";

import getForeGoundColors from "../../classes/ForegroundColors";
const fgc = getForeGoundColors()

const Speak = createCommand({
    name: 'speak',
    execute: async ({ message, chernoBot, args } : CommandParams ) => {

        const feedback = await chernoBot.speak( args )
       
        feedback?.data?.then(() => {
            console.log('terminei de falar')
        })

        /// fazer os retornos das funções virem aqui em vez de iniciar a cadeia de funções

    
    },

    description: fgc.Cyan('Lê a mensagem enviada.')
})


export default Speak
import CommandParams from "../../interfaces/CommandParams.Type";
import createCommand from "../../utils/CreateCommand";

import getForeGoundColors from "../../classes/ForegroundColors";
import Log from "../../config/Logger";
const fgc = getForeGoundColors()

const Speak = createCommand({
    name: 'speak',
    execute: async ({ message, chernoBot, args } : CommandParams ) => {

        try {
            const { content, configs } = chernoBot.argsToSpeak( args )

            const buffer  = await chernoBot.createAudio( content, configs )

            await chernoBot.playAudio( buffer )


        } catch ( err ){
            Log.error('Speak> O TTS falhou', err as Error)
        }
        
    },

    description: fgc.Cyan('Lê a mensagem enviada.')
})


export default Speak

/*
    const url = new URL('https://glados.c-net.org/generate');
    url.searchParams.append('text', content);

    const response = await fetch(url.toString())

    if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from( arrayBuffer )

*/
import CommandParams from "../interfaces/CommandParams.Type";
import createCommand from "../utils/CreateCommand";

import getForeGoundColors from "../classes/ForegroundColors";
import Log from "../config/Logger";
const fgc = getForeGoundColors()

function sendRequest( msg: string ){
    return fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama3.2",
            prompt: msg
        })
    })
}

function extractJsonResponses(buffer: string, callback: ( aIresponse:string ) => void) {
    let finalResponse = ''
    let boundary;
    while ((boundary = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, boundary).trim();
        buffer = buffer.slice(boundary + 1);

        if (line) {
            try {
                const parsed = JSON.parse(line);
                if (parsed.response) {
                    finalResponse += parsed.response;
                }
                if ( parsed.done ) {

                    callback( finalResponse )

                    return
                }
            } catch (err) {
                console.error("Erro ao processar JSON:", err);
            }
        }
    }
    return finalResponse;
}

async function processResponse( response:Response ) {
    if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
    }
    Log.info('AI> Solicitação aceita. Gerando mensagem')

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let finalResponse = "";

    while ( true ) {

        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true })

        extractJsonResponses(buffer, ( aIResponse: string ) => {

            finalResponse += aIResponse

            Log.info(`AI> Resposta do Modelo: ${ aIResponse }`)

        })

    }

    return finalResponse
}

const IA = createCommand({
    name: "ia", 
    execute: async ( { message, chernoBot }: CommandParams ) => {

        try {

            if( !message.channel.isSendable() ) return
    
            const sender = message.author.globalName
    
            const msg = message.content.replace('-ia', '')

            message.channel.sendTyping()

            Log.info('AI> Enviando solicitação à rede')
            const request = await sendRequest( `sender:"${sender} ${msg}` )
            
            const aIResponse = await processResponse( request )

            if( !aIResponse ) return

            if( message.member?.voice.channel?.id && chernoBot.getConnection() ){
                
                Log.info('AI> Usuário esta em canal de voz. Iniciando a fala')

                chernoBot.speak( aIResponse.split(' ') )

            }

            message.reply( aIResponse )

        } catch ( ex ) {
            
            const errorMsg = 'A Rede neural não esta ativa'

            message.reply( errorMsg )

            Log.error( errorMsg, ex as Error )
        }


    },

    description: fgc.Cyan('Interagir com IA. O bot fala quando em call.')
})

export default IA
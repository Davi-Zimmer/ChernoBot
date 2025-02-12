import CommandParams from "../interfaces/CommandParams.Type";
import createCommand from "../utils/CreateCommand";

import getForeGoundColors from "../classes/AnsiText";
const fgc = getForeGoundColors()

const IA = createCommand({
    name: "ia", 
    execute: async ( { message, chernoBot }: CommandParams ) => {

        // message.reply("Essa versão ainda não tem integração com a rede neural")
        function gerateMsg( msg:string, messageCompleted: ( a:string ) => void ){
            fetch("http://localhost:11434/api/generate", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  model: "llama3.2",
                  prompt: msg
                })
              })
                .then(async (response) => {
                    if (!response.ok) {
                        throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
                    }
                
                    const reader = response.body?.getReader()

                    if(!reader) return

                    const decoder = new TextDecoder("utf-8")
                
                    let buffer = ""; // Acumula dados parciais
                    let finalResponse = ""; // Armazena o texto gerado
                
                    while (true) {
                        const { done, value } = await reader.read()
                        if (done) break;
                
                        const chunk = decoder.decode(value, { stream: true })
                        buffer += chunk
                
                        // Processar cada JSON completo dentro do buffer
                        let boundary;
                        while ((boundary = buffer.indexOf("\n")) !== -1) {
                            const line = buffer.slice(0, boundary).trim() // Pega uma linha completa
                            buffer = buffer.slice(boundary + 1) // Remove a linha processada do buffer
                    
                            if (line) {
                                try {
                                const parsed = JSON.parse(line) // Parse da linha JSON
                    
                                if (parsed.response) {
                                    finalResponse += parsed.response // Concatena o texto gerado
                                }
                    
                                if (parsed.done) {

                                    messageCompleted( finalResponse )
                    
                                    return
                                }
                                } catch (err) {
                                    console.error("Erro ao processar JSON:", err)
                                }
                            }
                        }
                    }
                })
                .catch(error => {
                  console.error("Erro:", error);
                  message.reply("A Rede neural não esta ativa.")
                });

        }

        if( !message.channel.isSendable() ) return

        message.channel.sendTyping()

        const sender = message.author.globalName

        const msg = message.content.replace('-ia', '')

        gerateMsg(`sender:"${sender} ${msg}`, aIResponse => {

            if( message.member?.voice.channel?.id && chernoBot.getConnection() ){

                chernoBot.speak( aIResponse.split(' ') )

            }

            message.reply( aIResponse )

        })

    },

    description: fgc.Cyan('Interagir com IA. O bot fala quando em call.')
})

export default IA
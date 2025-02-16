import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import createCommand from "../utils/CreateCommand";
import getForeGoundColors from "../classes/ForegroundColors";

const fgc = getForeGoundColors()


let terminal: ChildProcessWithoutNullStreams | null = null

function startProcess(){
    const terminal = spawn('ollama', ['serve'])

    terminal.stdout.on('data', (data) => {
       
        console.log(  data.toString() )
    
    })

    return terminal
}

const StartAI = createCommand({
    name: 'neural',
    execute: ({ message, args }) => {

        const param = args.shift()

        switch( param ){
            case 'start' : {
                if( !terminal ) {

                    terminal = startProcess()
    
                    message.reply('Rede neural pronta pra interação.')
    
                } else {
                    
                    message.reply('Rede neural ja esta pronta.')
                    
                }
                break
            }

            case 'end' : {

                if( !terminal ) {

                    message.reply('IA ja esta desativada.')
                    
                    return
                }
    
                terminal.on('close', () => {
    
                    message.reply('IA desativada.')
    
                    terminal = null
                })
    
                terminal.kill()

                break
            }

            default : {
                const status = terminal === null ? 'inativa' : 'ativa'

                message.reply(
                    `\`-neural start\` para iniciar a rede e \`-neural end\` para encerra-la.\n` +
                    `Agora a rede está ${status}.`
                )
                
                break
            }

        }


    },

    description: `${fgc.Pink('<start | end>')} ${fgc.Cyan('Inicia ou encerra a IA.')}`
})

export default StartAI
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import createCommand from "../../utils/CreateCommand";
import getForeGoundColors from "../../classes/ForegroundColors";
import Log from "../../config/Logger";

const fgc = getForeGoundColors()


let terminal: ChildProcessWithoutNullStreams | null = null

export function startProcess(){
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

        // console.log( param )
        // console.log( terminal )

        switch( param ){
            case 'start' : {
                Log.info('Neural> Start')

                if( !terminal ) {

                    terminal = startProcess()
    
                    message.reply('Rede neural pronta pra interação.')

                    Log.info('Neural> servidor da IA rodando.')
    
                } else {
                    
                    message.reply('Rede neural ja esta pronta.')

                    Log.info('Neural> servidor da IA ja esta rodando.')

                }
                break
            }

            case 'end' : {
                Log.info('Neural> End')

                if( !terminal ) {

                    message.reply('IA ja esta desativada.')
                    
                    Log.info('Neural> O servidor não foi aberto ainda')
                    return
                }
    
                terminal.on('close', () => {
    
                    message.reply('IA desativada.')

                    Log.info('Neural> Servidor da IA foi fechado.')

                    terminal = null
                })
    
                terminal.kill()

                setTimeout(() => {
                    if( terminal ) Log.info('Neural> O servidor da IA permanece aberto após o comando de Fechar ')
                }, 2000)
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
import getForeGoundColors from "../classes/AnsiText";
import CommandParams from "../interfaces/CommandParams.Type";
import createCommand from "../utils/CreateCommand";

const fgc = getForeGoundColors()

const Batch = createCommand({
    name: 'batch',
    execute: ( { message, args, chernoBot }: CommandParams ) => {
        
        const commands = args.join(' ').replaceAll('\n', '').split(';')

        console.log( commands )

        commands.forEach( async command => {
            
            chernoBot.commandBridge( command, message )

        })

    },

    description: fgc.Cyan('Executa vários comandos de uma só vez.')
})


export default Batch
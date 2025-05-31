import getForeGoundColors from "../../classes/ForegroundColors";
import CommandParams from "../../interfaces/CommandParams.Type";
import createCommand from "../../utils/CreateCommand";

const fgc = getForeGoundColors()

const Batch = createCommand({
    name: 'batch',
    execute: async ( { message, args, chernoBot }: CommandParams ) => {
        
        const commands = args.join(' ').replaceAll('\n', '').split(';')

        for( const command of commands ){
            
            const commandArgs = command.split(' ')
            const commandName = commandArgs.shift()!

            await chernoBot.commandBridge( message, commandName, commandArgs )            
        }
    },

    description: fgc.Cyan('Executa vários comandos de uma só vez.')
})


export default Batch
import CommandParams from "../interfaces/CommandParams.Type";
import createCommand from "../utils/CreateCommand";

import espeak from 'espeak'

import path from "path";


function processMessage( args: string[] ){

    const commands = new Set([
       '-s', '-v', '-p' 
    ])
    
    const params: string[][] = []

    let limit = 0

    while (limit < 3) {
        
        const [ cmd ] = args

        if( commands.has( cmd ) ) params.push( args.splice(0, 2) )
        
        limit += 1
    }


    return {params, args}
}

function getParambsAndLanguage ( params: string[][] ) {
    let lang = ['-v', 'pt']

    const restParams : string[] = []

    params.forEach( e => {
        if(e[0] == '-v'){

            lang = [ e[0], e[1] ]

            return
        } 

        restParams.push( ...e )
        
    })

    return { lang, params: restParams }
}

const Speak = createCommand({
    name: 'speak',
    execute: ({ message, chernoBot, args } : CommandParams ) => {

        const msg = processMessage( args )

        const content = msg.args.join(' ')
    
        if( !content ){

            message.reply('Informe o que vai ser falado')

            return
        }

        espeak.cmd = path.join( __dirname, '../speaker/command_line/espeak.exe');
        
        const { lang, params } = getParambsAndLanguage( msg.params )
        
        const configs = [...lang, ...params]
        
        espeak.speak(content, configs, function(err, wav) {

        if (err) return console.error(err)
            
            if( !chernoBot.isInVoiceChannel() ) return
            
            chernoBot.playAudio( wav.buffer )
            
        });
            
    }
})


export default Speak
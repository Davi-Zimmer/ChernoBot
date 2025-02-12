const rnd = ( n: number = 1 )  => Math.floor( Math.random() * n )

function processMessageToSpeak( args: string[] ){

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

function getParamsAndLanguage ( params: string[][] ) {
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

export { 
    rnd, 
    processMessageToSpeak, 
    getParamsAndLanguage 
}
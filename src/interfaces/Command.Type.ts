import CommandParams from "./CommandParams.Type"

export default interface CommandType {

    name: string

    execute: ( object : CommandParams  ) => void

    options ?: {
        admin    ?: boolean // permite apenas para cargos com admin 
        isHidden ?: boolean // esconde o comando da listagem de comandos
        disabled ?: boolean // se vai ser utilizado
    },
    descriotion ?: string  // a descrição vai aparecer na apresentação de comandos
    
}

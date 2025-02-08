import CommandType from "../interfaces/Command.Type"

// estrutura fútil, mas da pra fazer tratamento de algo nos comandos futuramente.

const createCommand = ({name, execute, options} : CommandType ) => {

    return { 
        name,
        options,
        execute
    }
}

export default createCommand
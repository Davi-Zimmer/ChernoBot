import CommandType from "../interfaces/Command.Type"

// estrutura fútil, mas da pra fazer tratamento de algo nos comandos futuramente.

const createCommand = ({ name, execute, description = 'Sem Descrição.', options } : CommandType ) => {

    return { 
        name,
        options,
        description,
        execute
    }
}

export default createCommand
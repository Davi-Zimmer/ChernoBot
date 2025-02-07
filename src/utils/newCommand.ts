import CommandParams from "../types/CommandParams.Type"

const newCommand = ( name:string, execute: ( object:CommandParams ) => void ) => {
    return { 
        name,
        execute
    }
}

export default newCommand
import { CommandParams } from "./CommandParams.Type"

export default interface CommandType {

    name: string

    isStrict?: boolean

    isHidden?: boolean

    execute: ( object : CommandParams  ) => void
    
}

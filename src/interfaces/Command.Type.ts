import { PermissionFlagsBits, PermissionsBitField } from "discord.js"
import CommandParams from "./CommandParams.Type"
import { ForegroundColors, StringFunc } from "./ForeGroundColor.Types"

export default interface CommandType {

    name: string

    execute: ( object : CommandParams  ) => void

    options ?: {
        admin    ?: boolean // permite apenas para cargos com admin 
        isHidden ?: boolean // esconde o comando da listagem de comandos
        disabled ?: boolean // se vai ser utilizado
        permissions ?: bigint[]  
    },
    description?:  string,   // a descrição vai aparecer na apresentação de comandos
    
}

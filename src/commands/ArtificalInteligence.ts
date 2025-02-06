import { Message } from "discord.js"
import newCommand from "../utils/newCommand"
import { CommandParams } from "../types/CommandParams.Type"

const ia = newCommand("ia", async ( { message }: CommandParams ) => {

    message.reply("Essa versão ainda não tem integração com a rede neural")

})

export default ia
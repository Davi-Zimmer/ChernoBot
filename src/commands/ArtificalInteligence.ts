import { Message } from "discord.js"
import CommandParams from "../types/CommandParams.Type";
import newCommand from "../utils/newCommand";

const IA = newCommand("ia", async ( { message }: CommandParams ) => {

    message.reply("Essa versão ainda não tem integração com a rede neural")

})

export default IA
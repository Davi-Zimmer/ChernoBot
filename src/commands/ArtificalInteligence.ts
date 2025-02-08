import CommandParams from "../interfaces/CommandParams.Type";
import createCommand from "../utils/CreateCommand";

const IA = createCommand({
    name:"ia", 
    execute: async ( { message }: CommandParams ) => {

        message.reply("Essa versão ainda não tem integração com a rede neural")

    }
})

export default IA
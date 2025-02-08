import CommandParams from "../interfaces/CommandParams.Type";
import createCommand from "../utils/CreateCommand";

const Leave = createCommand({
    name: 'leave',
    execute: ({ message, chernoBot }: CommandParams) => {

        const connection = chernoBot.getConnection()

        if( !chernoBot.isInVoiceChannel() ){

            message.reply('Não estou em nenhuma call.')
            
            return
        }

        connection?.destroy()


    }
})

export default Leave
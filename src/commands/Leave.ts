import CommandParams from "../types/CommandParams.Type";
import newCommand from "../utils/newCommand";

const Leave = newCommand('leave', ({ message, chernoBot }: CommandParams) => {

    const connection = chernoBot.getConnection()

    if( !chernoBot.isInVoiceChannel() ){

        message.reply('Não estou em nenhuma call.')
        
        return
    }

    connection?.destroy()


})

export default Leave
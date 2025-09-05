import DataManager from "../../database/DataManager";
import CommandParams from "../../interfaces/CommandParams.Type";
import createCommand from "../../utils/CreateCommand";
import getForeGoundColors from "../../classes/ForegroundColors";
const fgc = getForeGoundColors()

const Ignore = createCommand({
    name: 'ignore',
    execute: async ( { message, args } : CommandParams ) => {

        const newUser = args.map( arg => arg.replaceAll('<', '').replaceAll('>', '').replaceAll('@', ''))

        if( newUser.length == 0 ){
            message.reply('Digite o id dos usuários.')
            return
        }

        let ids = DataManager.GetItem( 'ignoreUsers' ) as string[] | null
        if( !ids ) {
            DataManager.SetItem( 'ignoreUsers', [])
            ids = []
        }

        let asdasd: string[] = []

        newUser.forEach( userId => {
            if( process.env.OWNER_ID === userId ){
                if( message.channel.isSendable() ){
                    message.channel.send('Não é possivel ignorar o desenvolvedor do bot\n XD')
                }
                return
            }

            const exists = ids.find( e => e === userId )
            
            if( exists ) asdasd.push( userId )
            else ids.push( userId )           

        })
        
        DataManager.SetItem( 'ignoreUsers', ids )

        if( asdasd.length !== 0) {
            let usersString = asdasd.map( userId => `<@${userId}>,` ).join(' ')
            
            const users = usersString.substring( 0, usersString.length-1)

            if( asdasd.length === 1) message.reply(`${users} já está na lista.`)
            else message.reply(`${users} já estão na lista.`)
        }

    },
    description: fgc.Cyan('Adiciona os usuários na lista negra que impede de usarem comandos.'),

    options:{
        devOnly: true,
        ownerOnly: true
    }
})

export default Ignore
import DataManager from "../../database/DataManager";
import CommandParams from "../../interfaces/CommandParams.Type";
import createCommand from "../../utils/CreateCommand";
import getForeGoundColors from "../../classes/ForegroundColors";
const fgc = getForeGoundColors()

const UnIgnore = createCommand({
    name: 'unIgnore',
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

        ids = ids.filter(userId => !newUser.some(newUserId => userId === newUserId))

        DataManager.SetItem( 'ignoreUsers', ids )

        if( newUser.length !== 1 )message.reply( 'Usuário não está mais na ignorados')
        else message.reply( 'Usuários não estão mais na ignorados')

    },
    description: 'Remove os usuários na lista',
    options:{
        devOnly: true
    }
})

export default UnIgnore
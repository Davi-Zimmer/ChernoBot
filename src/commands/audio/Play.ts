import CommandParams from "../../interfaces/CommandParams.Type";
import createCommand from "../../utils/CreateCommand";
import path from "path";
import ffmpeg from "@ffmpeg-installer/ffmpeg";

process.env.FFMPEG_PATH = ffmpeg.path;

import getForeGoundColors from "../../classes/ForegroundColors";
const fgc = getForeGoundColors()

const Play = createCommand({
    name:'play',
    execute: async ( { chernoBot, args } : CommandParams ) => {
    
        if( !chernoBot.isInVoiceChannel() ){
            // esperar o bot entrar na call
            return
        }

        const audioUrl = args.shift()
    
        // const audioPath = audioUrl ?? path.join( __dirname, '../audio/nuclear siren.mp3')
        const audioPath = audioUrl ?? path.join( __dirname, '../../audio/telepatia.mp3')
        
        console.log( audioPath )

        await chernoBot.playAudio( audioPath )
        
    },

    description: fgc.Cyan('Toca um audio apartir do link.')
})

export default Play 
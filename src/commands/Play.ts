import CommandParams from "../interfaces/CommandParams.Type";
import createCommand from "../utils/CreateCommand";
import path from "path";
import ffmpeg from "@ffmpeg-installer/ffmpeg";

process.env.FFMPEG_PATH = ffmpeg.path;


const Play = createCommand({
    name:'play', execute:( { chernoBot, args } : CommandParams ) => {

    
        if( !chernoBot.isInVoiceChannel() ){
            return
        }

        const audioUrl = args.shift()
    
        const audioPath = audioUrl ?? path.join( __dirname, '../audio/nuclear siren.mp3')
    
        chernoBot.playAudio( audioPath )
        
    }
})

export default Play 
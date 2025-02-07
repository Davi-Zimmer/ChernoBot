import { AudioPlayerStatus, createAudioPlayer, createAudioResource, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import CommandParams from "../types/CommandParams.Type";
import newCommand from "../utils/newCommand";
import path from "path";
import ffmpeg from "@ffmpeg-installer/ffmpeg";

process.env.FFMPEG_PATH = ffmpeg.path;


const Play = newCommand('play', ( {message, chernoBot, args} : CommandParams ) => {

    const connection = chernoBot.getConnection()

    if( !chernoBot.isInVoiceChannel() ){
        return
    }

    /*
    connection?.addListener(VoiceConnectionStatus.Ready, () => {
        // connected

    })
    */

    const player = createAudioPlayer()

    const audioUrl = args.shift()

    const audioPath = audioUrl ?? path.join( __dirname, '../audio/nuclear siren.mp3')

    const src = createAudioResource( audioPath ) 

    player.play( src )

    connection?.subscribe( player )

    player.on(AudioPlayerStatus.Idle, () => {

        // connection.destroy();

    });

})

export default Play 
import CommandParams from "../../interfaces/CommandParams.Type";
import { chernoBot } from "../../main/Main";
import createCommand from "../../utils/CreateCommand";
import path from "path"
import { spawn } from "child_process";

const audioPath = path.join( __dirname, "..", "..", "audio")

async function createAudio(text: string) {
    const tts = path.join( process.env.TTS_PATH! );
    const ttsModel = path.join( process.env.TTS_MODEL!);

    // const wavFile = Date.now() + ".wav";
    const wavFile = "audio" + ".wav";
    const wavFilePath = path.join( audioPath, wavFile);

    return new Promise((resolve, reject) => {
        const piper = spawn(tts, ["-m", ttsModel, "-f", wavFilePath]);

        piper.stdin.write(text, "utf8");
        piper.stdin.end();

        piper.on("close", (code) => {
        if (code === 0) {
            resolve(wavFile);
            } else {
                reject(new Error(`Piper exited with code ${code}`));
            }
        });

        piper.on("error", (err) => reject(err));
    });
}

const Say = createCommand({
    name: 'say',
    execute: async ({ chernoBot, args } : CommandParams ) => {
        const phrase = args.join(' ')

        const audioFile = await createAudio( phrase ) as string

        const generatedAudioPath = path.join( audioPath, audioFile )

        chernoBot.playAudio( generatedAudioPath )

    }
})


export default Say
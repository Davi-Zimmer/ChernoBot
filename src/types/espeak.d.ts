declare module "espeak" {
    interface SpeakOptions {
        pitch?: number;
        speed?: number;
        voice?: string;
    }

    interface Speak {
        (
            text: string,
            options?: string[],
            callback?: (err: Error | null, wav: { buffer: Buffer }) => void
        ): void;
    }


    const cmd: string

    const speak: Speak;
    export { speak, cmd };
}

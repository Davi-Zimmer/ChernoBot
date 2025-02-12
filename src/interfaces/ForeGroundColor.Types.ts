type StringFunc = ( text:string ) => string

interface ForegroundColors {
    Red    : StringFunc
    Yellow : StringFunc
    Orange : StringFunc
    Blue   : StringFunc
    Pink   : StringFunc
    Cyan   : StringFunc
    White  : StringFunc
}

export { ForegroundColors, StringFunc}
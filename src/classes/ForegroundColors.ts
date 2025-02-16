function getForeGoundColors() {
    const reset = '[0m'
    
    const FG = {
       Red    : (text:string) => `[2;31m${text}${reset}`,
       Yellow : (text:string) => `[2;32m${text}${reset}`,
       Orange : (text:string) => `[2;33m${text}${reset}`,
       Blue   : (text:string) => `[2;34m${text}${reset}`,
       Pink   : (text:string) => `[2;35m${text}${reset}`,
       Cyan   : (text:string) => `[2;36m${text}${reset}`,
       White  : (text:string) => `[2;37m${text}${reset}` 
    }

    return FG
}

export default getForeGoundColors
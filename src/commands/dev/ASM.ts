import createCommand from "../../utils/CreateCommand";


function extractCode(message: string): string {
    // remove prefixo do comando, ex: "-asm "
    let code = message.replace(/^(-asm|\/asm)\s*/, "");

    // remove ``` no começo e fim
    code = code.replace(/```(asm)?/g, "");

    // trim espaços extras
    code = code.trim();

    return code;
}

const ASM = createCommand({
    name: 'asm',
    execute: async ({ message, chernoBot, args }) => {


    }
})


export default ASM
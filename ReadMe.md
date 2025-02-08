# Dependências externas
Até a versão X.X.X.X, existe apenas uma depencência
[Espeak](https://espeak.sourceforge.net/download.html) baixe a versão (Compiled for Windows. SAPI5 and command-line versions.)


# Instalação
- `npm install` ou `npm i` no console pra baixar as depencências.
- Se quiser o speaker, baixe-o e instale dentro da pasta "speaker" em `src/speaker`, caso contrario, desavite o comando "Speak" em `src/commands/Speak.ts`, adicionando `{ options: { disabled: true } }` no objeto do `createCommand`


# Transpilação
Não é possivel transpilar ainda, seja la qual for o motivo ou configuração.




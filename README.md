# Vem prá Hilux

Jogo de sedução com humor sertanejo, estilo conversa de WhatsApp. **+18, não explícito.**

Joga em: https://siruben.github.io/vem-pra-hilux/

## Estrutura
- `index.html`: o jogo (HTML, CSS e JavaScript)
- `assets/img/`: avatares, capa, fundo do chat, selfie, pickup e os 5 finais
- `assets/audio/`: música de fundo, canção original e as notas de voz
- `assets/icons/`: ícone da app
- `manifest.webmanifest` e `sw.js`: instalação no telemóvel e modo offline

## Atualizar imagens ou áudios
Substitui o ficheiro mantendo o nome e muda a versão em `sw.js` (`const V = 'hilux-v2'`), para os telemóveis voltarem a descarregá-lo.

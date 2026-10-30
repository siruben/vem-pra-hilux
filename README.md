# Vem prá Hilux

Jogo de sedução com humor sertanejo, estilo conversa de WhatsApp. **+18, não explícito.**

Joga em: https://siruben.github.io/vem-pra-hilux/

## Estrutura
- `index.html`: o jogo (HTML, CSS e JavaScript)
- `assets/img/`: avatares, capa, fundo do chat, selfie, pickup e os 5 finais
- `assets/audio/`: música de fundo, canção original e notas de voz
- `assets/icons/`: ícones da app
- `manifest.webmanifest` e `sw.js`: instalação no telemóvel e modo offline
- `ROADMAP.md`: prioridades, critérios de aceitação e testes de regressão

## Atualizar imagens ou áudios
Substitui o ficheiro mantendo o nome e incrementa a versão `V` em `sw.js`. A app shell é necessária para instalar o Service Worker; os restantes recursos multimédia são guardados individualmente para que um ficheiro opcional em falta não bloqueie a instalação.

## Plano de evolução
Consulta [ROADMAP.md](ROADMAP.md) para o plano por fases e a lista de testes manuais.

## Verificações automáticas
O GitHub Actions executa smoke tests em pull requests e em pushes para `main`. Os testes verificam a existência dos ficheiros essenciais, a validade JSON do manifesto e a sintaxe dos scripts JavaScript. Não substituem testes reais no navegador ou no telemóvel.

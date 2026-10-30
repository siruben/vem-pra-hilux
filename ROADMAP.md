# Plano de evolução — Vem prá Hilux

Objetivo: melhorar a estabilidade, a experiência móvel e o acabamento visual sem perder a identidade do jogo: Célia, Rubinho, a pickup, o rodeio e o humor.

## Princípios
- Preservar a experiência atual e a direção artística.
- Fazer alterações pequenas, reversíveis e verificáveis.
- Priorizar falhas que prejudiquem o arranque, o áudio ou o modo offline.
- Evitar dependências e serviços externos desnecessários.

## Fase 1 — Estabilidade (prioridade máxima)
- [x] Versionar corretamente o cache do Service Worker.
- [x] Evitar que um recurso multimédia em falta impeça a instalação offline.
- [x] Melhorar suporte a pedidos HTTP Range para áudio em cache, incluindo intervalos de sufixo e inválidos.
- [ ] Rever fallback e concorrência da reprodução de música e vozes.
- [ ] Testar instalação, atualização e arranque offline em Android/Chrome e desktop.

## Fase 2 — Progresso e usabilidade
- [ ] Guardar progresso da partida e melhor pontuação de forma resiliente.
- [ ] Permitir reiniciar uma partida sem recarregar a página.
- [ ] Melhorar estados de carregamento, erros de áudio e controlos de acessibilidade.
- [ ] Rever apresentação em ecrãs pequenos e orientação vertical.

## Fase 3 — Narrativa e acabamento
- [ ] Criar galeria dos cinco finais desbloqueados.
- [ ] Testar todas as faixas de pontuação e confirmar que cada final é alcançável.
- [ ] Equilibrar pontuação e dificuldade dos minijogos.
- [ ] Acrescentar variações narrativas sem aumentar desnecessariamente o peso da app.

## Fase 4 — Qualidade contínua
- [ ] Adicionar verificações automáticas de sintaxe e dos ficheiros essenciais.
- [ ] Documentar um roteiro de regressão antes de cada publicação.
- [ ] Medir o peso total dos recursos e otimizar imagens/áudios se necessário.

## Critérios de aceitação da Fase 1
1. O Service Worker instala-se mesmo se um recurso opcional estiver temporariamente indisponível.
2. Uma nova versão do cache substitui a antiga após ativação.
3. A página abre offline depois de ter sido carregada online uma vez.
4. Pedidos de intervalo de áudio devolvem 206 com Content-Range correto; intervalos fora do ficheiro devolvem 416.
5. A conversa, os minijogos, os finais e os controlos de som continuam funcionais.

## Testes manuais de regressão
- Abrir a app online e navegar por todos os ecrãs.
- Ativar/desativar música e efeitos sonoros.
- Reproduzir cada nota de voz e alternar entre duas vozes.
- Concluir dança, memória musical, desvio dos touros e aceleração.
- Confirmar que os cinco finais podem ser apresentados em condições apropriadas.
- Instalar a PWA, atualizar a versão e testar modo avião.
- Verificar a consola do navegador por erros e pedidos falhados.

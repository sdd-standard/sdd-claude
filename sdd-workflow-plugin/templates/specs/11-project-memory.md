# 11 — Project Memory
<!-- TETO E DENSIDADE (Paginação Elástica / Overflow Sharding):
     1. Gatilho de paginação: 150 linhas OU 7.000 caracteres, o que vier primeiro. Este arquivo é injetado no início de cada sessão. O Claude Code limita cada contexto injetado por hook a 10.000 caracteres (acima disso o modelo recebe só um caminho de arquivo e os primeiros 2.000 caracteres). O hook do plugin reserva ~3.000 para alertas, tasks e changes e injeta a memória inteira se couber; se não couber, injeta só Estado Atual, Próximos Passos e Pendências e manda ler o arquivo inteiro. O gatilho não autoriza cortar informação: ele indica que é hora de rotacionar (item 3) ou criar o shard (item 4). Os títulos "Estado Atual", "Próximos Passos Imediatos" e "Pendências em Aberto" são lidos pelo hook: não os renomeie.
     2. Roll-up: ao fechar o gate de um milestone, comprima as entradas por-task dele em 1 linha cada (o detalhe vive no ledger e no git).
     3. Rotação histórica: mantenha apenas as ~5 mudanças/milestones mais recentes aqui. Ao fechar uma mudança, mova o resumo das mais antigas para docs/sdd/archive/memory-history.md (append-only, cold storage).
     4. Paginação Elástica (Overflow Sharding): se o projeto possuir múltiplas frentes ATIVAS simultâneas que legitimamente ultrapassem 150 linhas, crie docs/sdd/11-project-memory-02.md nos mesmos moldes e adicione o link no bloco "Paginação Ativa" abaixo. Assim que as frentes forem concluídas e o conteúdo ativo voltar a caber nos dois tetos, consolide de volta aqui, remova o link e EXCLUA o arquivo 11-project-memory-02.md. -->

<!-- Descomente o bloco abaixo apenas quando existir arquivo paginado ativo (-02.md):
> 📄 **Paginação Ativa (Overflow):**
> - [11-project-memory-02.md](./11-project-memory-02.md) — <escopo ou frentes ativas contidas na página 02>
-->

### Estado Atual
- Fase:
- Última atualização: <data> — evento: <o que disparou>
- Histórico completo (cold storage): `docs/sdd/archive/memory-history.md`

### Resumo Executivo do Progresso

### Decisões de Arquitetura Travadas

### Próximos Passos Imediatos

### Pendências em Aberto (Blockers)

### Mapa de Estabilidade
- Estáveis:
- Em mutação:

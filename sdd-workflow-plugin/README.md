# sdd-workflow — Plugin de Spec-Driven Development para Claude Code

Workflow SDD completo e reutilizável: constitution, specs GEARS, delta specs, ledger de tasks, gates de validação, memória entre sessões e roteamento de modelos por papel. Funciona em projetos **novos** (`init`) e **existentes** (`adopt`).

## Instalação

Opção A — marketplace local (teste):

```text
claude
/plugin marketplace add <caminho-local-deste-repo>
/plugin install sdd-workflow
```

Opção B — via git (recomendado para uso contínuo): publique esta pasta num repositório GitHub e:

```text
/plugin marketplace add sdd-standard/sdd-claude
/plugin install sdd-workflow
```

> O marketplace precisa de um `.claude-plugin/marketplace.json` na raiz do repositório listando o plugin (ver docs do Claude Code). Atualizações do plugin chegam a todos os projetos que o instalaram.

## O que vem no pacote

| Peça | Conteúdo | Papel no SDD |
|---|---|---|
| `skills/` (7) | init, adopt, specify, design, tasks, implement, change | as fases do workflow como comandos (`/sdd-workflow:<nome>`) |
| `agents/` (4) | architect (opus), implementer (sonnet), validator (sonnet, read-only), doc-writer (haiku) | papéis com contexto isolado + roteamento de modelo |
| `hooks/` | session-start (injeta memória/tasks em toda sessão), guard-install (confirmação antes de instalar deps) | gates determinísticos; silencioso em projetos sem `docs/sdd/` |
| `templates/` | CLAUDE.md, constitution, specs 00–10, project-memory, proposal/delta/tasks | esqueletos que `init`/`adopt` copiam para o projeto |
| `.mcp.json.example` | exemplos de MCPs (GitHub, Postgres) | renomeie para `.mcp.json` para ativar |

Plan Mode não precisa de arquivo: a skill `implement` e o agente implementer o exigem em tasks não triviais.

## Uso

**Projeto novo:** `/sdd-workflow:init` → entrevista da constitution → `:specify` → `:design` → `:tasks` → loop de `:implement` → mudanças via `:change`.

**Projeto existente (grande):** `/sdd-workflow:adopt` — escaneia o código, extrai a constitution das convenções reais (e entrevista você sobre as desejadas), gera uma baseline mínima *as-built* (brief, spec de capacidades, mapa de domínio, arquitetura atual) e prepara o ledger. **Não** faz retro-spec do sistema inteiro. A partir daí:

- Nova feature/alteração → `/sdd-workflow:change` (proposal → delta-spec → tasks → apply → archive).
- **Spec-on-touch:** se a mudança toca uma área nunca especificada, o delta inclui a spec mínima daquela área. A especificação cresce organicamente onde o projeto está vivo.
- Feature muito grande → `:specify` escopado só àquela feature.

## Convenções que o plugin impõe

Nenhum código sem task In Progress rastreável a requisito · GEARS com keywords em inglês · ambiguidade vira PENDENTE DE DEFINIÇÃO · memória atualizada por evento (máx. 150 linhas) · specs pós-baseline só mudam via delta · confirmação antes de instalar dependências.

## Gate de milestone e gestão de dívida (v1.1)

Ao fechar um milestone, o `sdd-validator` audita o **código real** (não o relatório do implementer), citando `arquivo:linha` e caçando interações com infra global que os testes por módulo não exercitam. Regras:

- **Bloqueio:** Critical/High barram o avanço; só passam como ressalva com aceite explícito do usuário, registrados como dívida ativa. Milestone seguinte exige aprovação manual; commit só sob pedido.
- **Duas camadas de achados:** o registro completo do gate fica no ledger (`07-tasks.md`); **todo achado que fica aberto — qualquer severidade — também vai para `10-validation.md`**, que passa a ser o backlog vivo de dívida e o ponto de partida dos próximos `/change`. Só achado corrigido no gate vive apenas no ledger.
- **Higiene de contexto:** `10-validation.md` guarda SÓ dívida ativa (é lido no protocolo de sessão e pela skill implement, então precisa ser enxuto). Ao resolver, a entrada é MOVIDA para `docs/sdd/archive/validation-log.md` — um log append-only, cold storage, consultado por ID sob demanda e nunca injetado. A rastreabilidade ledger↔global↔log se mantém porque o ID é preservado e nunca reutilizado.
- **Emenda datada:** divergência que apenas *restringe* o design (sem mudar comportamento/escopo) vira nota datada no artefato, aprovada no turno e com ponteiro de reconciliação — em vez de um `/change` completo. Mudança de comportamento continua exigindo `/change`.
- **Memória:** roll-up no fecho de cada milestone (entradas por-task comprimidas a 1 linha; o limite é de linhas *e* de densidade).

### Guarda mecânica de identificadores (v1.3)

`scripts/check-ids.mjs` roda no início do gate (o orquestrador executa; o validador consome a saída como evidência):

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/check-ids.mjs" .        # exit 1 se houver órfãs
node "${CLAUDE_PLUGIN_ROOT}/scripts/check-ids.mjs" . --json  # para CI
```

- **Zero configuração, serve a qualquer projeto:** não conhece nomes de feature — reconhece a gramática `PREFIXO[-ESCOPO][-Mn]-NÚMERO`, então `VAL-001`, `VAL-PA-001` e `VAL-auth-M1-03` são entendidos sem ninguém declarar o escopo. Prefixos extras via `--prefixes=ADR,REQ`.
- **Declaração** = o ID sozinho no início de linha dentro de `docs/sdd/` (inclui `archive/validation-log.md`: dívida resolvida continua sendo declaração válida). **Citação** = qualquer outra ocorrência, em qualquer arquivo.
- **Escopo por exclusão, nunca por inclusão:** varre o repositório inteiro menos `node_modules`, `dist`, `.git` etc. Pasta nova entra sozinha — foi o recorte "só `apps/api/src`" que deixou passar resíduo em `prisma/`.
- Reporta também **declaradas e nunca citadas** (furo de rastreabilidade). `--strict` faz isso falhar também.
- **Regra anti-reincidência:** achado mecanicamente verificável que já foi recomendado antes não pode virar "faça manualmente" — vira task de automação, e a dívida só fecha quando o script existe e está no gate.

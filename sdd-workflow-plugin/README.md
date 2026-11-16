# sdd-workflow — Plugin de Spec-Driven Development para Claude Code (v2.1)

Workflow SDD completo e reutilizável: constitution, specs GEARS, delta specs, ledger de tasks, Quality Gate 100% passivo em 3 camadas, entrevista escopada, paginação elástica de memória entre sessões e roteamento de modelos por papel. Funciona em projetos **novos** (`init`) e **existentes** (`adopt`).

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
| `skills/` (8) | `init`, `adopt`, `specify`, `design`, `tasks`, `implement`, `validate`, `change` | as fases do workflow como comandos (`/sdd-workflow:<nome>`) |
| `agents/` (4) | `architect` (`opus`), `implementer` (`sonnet`), `validator` (`sonnet`, 100% read-only), `doc-writer` (`haiku`) | papéis com contexto isolado + roteamento de modelo |
| `hooks/` | `session-start` (injeta memória, avisos de paginação `-02.md`/gatilho de 150 linhas ou de caracteres, tasks e changes ativas), `guard-install` (confirmação antes de instalar deps), `say-do-record` (`PostToolUse`/`PostToolUseFailure`: registra edições e comandos no ledger do Say-Do Gate) | gates determinísticos; silencioso em projetos sem `docs/sdd/` |
| `scripts/` | `check-ids.mjs`, `say-do-audit.mjs`, `say-do-lib.mjs` | Camada 0 do gate: guarda mecânica de IDs e auditoria passiva de execução de testes (ledger fora do repositório, na pasta temporária do SO) |
| `templates/` | `CLAUDE.md.template`, `constitution.md.template`, `specs/00..11` (incluindo `11-project-memory.md`), `changes/` e `archive/` | esqueletos que `init`/`adopt` copiam para a estrutura flat `docs/sdd/` |
| `.mcp.json.example` | exemplos de MCPs (GitHub, Postgres) | renomeie para `.mcp.json` para ativar |

Plan Mode não precisa de arquivo: a skill `implement` e o agente implementer o exigem em tasks não triviais.

## Uso

**Projeto novo:** `/sdd-workflow:init` → entrevista enxuta da constitution → `:specify` → `:design` → `:tasks` → loop de `:implement` → mudanças via `:change`.

**Projeto existente (grande):** `/sdd-workflow:adopt` — escaneia os manifestos e estrutura, extrai a constitution das convenções reais (e entrevista você sobre as desejadas), gera uma baseline mínima *as-built* (`00`, `02`, `04`, `05`, `07`, `10`, `11`) na estrutura flat `docs/sdd/` e prepara o ledger. **Não** faz retro-spec do sistema inteiro. A partir daí:

- Nova feature/alteração → `/sdd-workflow:change` (`proposal` → `delta-spec` → `tasks` → `apply` → `archive`).
- **Inspeção Escopada & Fatiamento:** o arquiteto lê apenas o domínio tocado, faz até 3–5 perguntas cirúrgicas com recomendação padrão e propõe fragmentar ou estreitar *changes* grandes demais.
- **Spec-on-touch & Validate-Gap:** se a mudança toca uma área nunca especificada, o agente diagnostica o gap contra o código existente e o delta inclui a spec mínima daquela área.
- Feature muito grande → `:specify` escopado só àquela feature.

## Convenções que o plugin impõe

Nenhum código sem task `In Progress` rastreável a requisito · GEARS com keywords em inglês · ambiguidade vira `PENDENTE DE DEFINIÇÃO` · memória e validação com gatilho de paginação de 150 linhas ou 7.000/16.000 caracteres por arquivo (sem cortar o conteúdo das dívidas) e paginação elástica (`-02.md`) que se auto-exclui ao sanar pendências · specs pós-baseline só mudam via delta · confirmação antes de instalar dependências.

## Orçamento de injeção de contexto (limitação do Claude Code)

O Claude Code mede cada `additionalContext` devolvido por hook e, acima de **10.000 caracteres**, troca o texto inteiro por um caminho de arquivo e uma prévia dos primeiros 2.000 caracteres — sem pedir ao modelo que leia o arquivo ([documentação de hooks](https://code.claude.com/docs/en/hooks)). Essa é uma limitação da plataforma, não do SDD.

O hook de início de sessão nunca depende desse corte. Ele monta a injeção por prioridade, dentro de **10.000 caracteres**:

1. alertas de paginação, shards `-02.md`, tasks ativas (até 15, títulos com até 80 caracteres) e changes ativas (até 10) — juntos, no máximo cerca de 3.000 caracteres;
2. o `11-project-memory.md` **inteiro**, se couber no que sobrou;
3. se não couber: só as seções **Estado Atual**, **Próximos Passos Imediatos** e **Pendências em Aberto**, precedidas do aviso `MEMÓRIA INCOMPLETA NESTA INJEÇÃO`, que manda o agente ler o arquivo inteiro antes de agir e aplicar a higiene (rotação ou shard `-02.md`).

Por isso o gatilho de paginação da memória neste plugin é **150 linhas ou 7.000 caracteres** (10.000 menos a reserva de ~3.000). O `10-validation.md` não é injetado (o hook só cita os shards) e segue o gatilho canônico de 150 linhas ou 16.000 caracteres. A `constitution.md` não é injetada por hook: o agente a lê inteira com a ferramenta de leitura, sem limite.

## Quality Gate 100% Passivo em 3 Camadas e Gestão de Dívida (v2.1)

Ao fechar um milestone (ou via `/sdd-workflow:validate`), o Gate opera em **3 camadas estritamente passivas (`read-only`)** — nenhuma camada altera código ou documentos; todas apenas reportam divergências para o implementador corrigir:

1. **Camada 0 — Piso Mecânico Passivo (`check-ids.mjs` + `say-do-audit.mjs`):**
   - `node "${CLAUDE_PLUGIN_ROOT}/scripts/check-ids.mjs" .` varre o repositório por exclusão e barra qualquer ID órfão antes de chamar o validador.
   - `node "${CLAUDE_PLUGIN_ROOT}/scripts/say-do-audit.mjs" .` (*Say-Do Gate*) lê o ledger gravado pelos hooks e comprova que a suíte de testes/build foi executada com `exit code 0` após a última modificação de código. Só `VERIFIED_PASS` libera; `NO_EVIDENCE` (ledger vazio) não é aprovação.
   - Com a Camada 0 falhando, o validador não é acionado (curto-circuito).
2. **Camada 1 — Estágio 1 do `sdd-validator` (Conformidade Estrita GEARS):**
   - Audita o **código real** (`arquivo:linha`) cláusula a cláusula contra os requisitos GEARS e `AC-xxx`, barrando omissões e invenções fora da spec (*anti-scope-creep*).
3. **Camada 2 — Estágio 2 do `sdd-validator` (Qualidade, Constitution e Infra Global):**
   - Audita aderência à `constitution.md`, segurança e interações com infraestrutura global da aplicação (middlewares, rotas raiz, auth, banco).

### Regras de Destino e Paginação Elástica:
- **Bloqueio:** `Critical`/`High` barram o avanço; só passam como ressalva com aceite explícito do usuário, registrados como dívida ativa.
- **Duas camadas de achados:** o registro completo do gate fica no ledger (`07-tasks.md`); **todo achado que fica aberto — qualquer severidade — também vai para `10-validation.md`**, que é o backlog vivo de dívida e ponto de partida dos próximos `/change`.
- **Cold Storage (`archive/`):** `10-validation.md` guarda SÓ dívida ativa. Ao resolver, a entrada é MOVIDA para `docs/sdd/archive/validation-log.md` (append-only, cold storage).
- **Paginação Elástica (`-02.md`):** se o volume legítimo de dívidas ativas ou memória ativa atingir o gatilho de paginação (150 linhas ou 7.000/16.000 caracteres), cria-se `10-validation-02.md` (ou `11-project-memory-02.md`) linkado no topo do arquivo principal. Assim que as pendências são sanadas e voltam a caber em 150 linhas, os itens retornam ao arquivo principal e o arquivo `-02.md` é excluído.

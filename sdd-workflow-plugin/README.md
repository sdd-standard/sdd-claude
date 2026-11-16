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
| `hooks/` | `session-start` (injeta memória, avisos de paginação `-02.md` e tasks ativas), `guard-install` (confirmação antes de instalar deps) | gates determinísticos; silencioso em projetos sem `docs/sdd/` |
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

Nenhum código sem task `In Progress` rastreável a requisito · GEARS com keywords em inglês · ambiguidade vira `PENDENTE DE DEFINIÇÃO` · memória e validação com teto de 150 linhas por arquivo, parágrafos curtos (máx. 4–5 linhas) e paginação elástica (`-02.md`) que se auto-exclui ao sanar pendências · specs pós-baseline só mudam via delta · confirmação antes de instalar dependências.

## Quality Gate 100% Passivo em 3 Camadas e Gestão de Dívida (v2.1)

Ao fechar um milestone (ou via `/sdd-workflow:validate`), o Gate opera em **3 camadas estritamente passivas (`read-only`)** — nenhuma camada altera código ou documentos; todas apenas reportam divergências para o implementador corrigir:

1. **Camada 0 — Piso Mecânico Passivo (`check-ids.mjs` + Comprovação de Testes):**
   - `node "${CLAUDE_PLUGIN_ROOT}/scripts/check-ids.mjs" .` varre o repositório por exclusão e barra qualquer ID órfão antes de chamar o validador.
   - Comprova que a suíte de testes/build foi executada com `exit code 0` após a última modificação de código (*Say-Do Check*).
2. **Camada 1 — Estágio 1 do `sdd-validator` (Conformidade Estrita GEARS):**
   - Audita o **código real** (`arquivo:linha`) cláusula a cláusula contra os requisitos GEARS e `AC-xxx`, barrando omissões e invenções fora da spec (*anti-scope-creep*).
3. **Camada 2 — Estágio 2 do `sdd-validator` (Qualidade, Constitution e Infra Global):**
   - Audita aderência à `constitution.md`, segurança e interações com infraestrutura global da aplicação (middlewares, rotas raiz, auth, banco).

### Regras de Destino e Paginação Elástica:
- **Bloqueio:** `Critical`/`High` barram o avanço; só passam como ressalva com aceite explícito do usuário, registrados como dívida ativa.
- **Duas camadas de achados:** o registro completo do gate fica no ledger (`07-tasks.md`); **todo achado que fica aberto — qualquer severidade — também vai para `10-validation.md`**, que é o backlog vivo de dívida e ponto de partida dos próximos `/change`.
- **Cold Storage (`archive/`):** `10-validation.md` guarda SÓ dívida ativa. Ao resolver, a entrada é MOVIDA para `docs/sdd/archive/validation-log.md` (append-only, cold storage).
- **Paginação Elástica (`-02.md`):** se o volume legítimo de dívidas ativas ou memória ativa ultrapassar 150 linhas, cria-se `10-validation-02.md` (ou `11-project-memory-02.md`) linkado no topo do arquivo principal. Assim que as pendências são sanadas e voltam a caber em 150 linhas, os itens retornam ao arquivo principal e o arquivo `-02.md` é excluído.

---
name: implement
description: Executa uma task do ledger SDD com Plan Mode e aciona ao final de cada milestone o Quality Gate 100% Passivo em 3 Camadas.
---

# SDD — Implement (Execução Guiada & Gate Passivo em 3 Camadas — v2.1)

1. **Protocolo de sessão**: `constitution.md` → `11-project-memory.md` → `10-validation.md` → ledger ativo:
   - **Baseline (greenfield)**: `docs/sdd/07-tasks.md`.
   - **Mudança ativa**: o memory indica qual change está em apply → leia APENAS `docs/sdd/changes/<ativa>/tasks.md` (verifique também se há avisos de arquivos paginados `-02.md`).
2. **Selecione a task**: a `In Progress` existente, ou a primeira `Pending` sem dependências bloqueadas. Confirme com o usuário em 1 linha.
3. **Gate de entrada**: task tem `Related Requirements` e `Done When`? Há achado `Critical`/`High` aberto **sem** `Risk Acceptance` do usuário no `10-validation.md`? Se sim → pare e reporte. Dívidas aceitas pelo usuário e dívidas de maturidade (`Medium`) não bloqueiam.
4. **Git & Execução**: feature → branch (conforme constitution). Marque `Status: In Progress` no ledger **antes** de tocar no código e delegue ao subagent **`sdd-implementer`** (que usará Plan Mode em tasks não triviais).
5. **Gate de saída da task (Evidência para o Say-Do Gate)**:
   - O implementador deve rodar a suíte de testes no terminal após a última edição de código e comprovar `exit code 0`. Os hooks `PostToolUse`/`PostToolUseFailure` registram essa execução no ledger do Say-Do Gate (inclusive quando feita dentro do subagent).
   - Testes verdes + `Done When` satisfeito → `Status: Done` + `11-project-memory.md` atualizado no mesmo turno.
6. **Documentação**: Se a task concluir funcionalidade visível, acione **`sdd-doc-writer`** (`README.md` + docs de feature) antes do PR/commit.

---

## 7. Gate de Milestone (100% Passivo em 3 Camadas — ao concluir a última task de um milestone):

> **Regra Inegociável de Passividade:** Todas as 3 camadas do Gate abaixo são **100% PASSIVAS (`read-only`)**. Elas apenas inspecionam e reportam divergências/erros para que o implementador/orquestrador realize as correções.

- **a. Camada 0 — Piso Mecânico Passivo** (você tem Bash; o validador não):
  1. Rode na raiz do projeto:
     ```bash
     node "${CLAUDE_PLUGIN_ROOT}/scripts/check-ids.mjs" .
     ```
     Ele varre o repositório INTEIRO (exclusão, nunca inclusão) e aponta siglas órfãs (IDs citados sem declaração) e declarações nunca citadas. `Exit 1` = há órfãs → corrija ANTES do gate.
  2. Rode o *Say-Do Gate*:
     ```bash
     node "${CLAUDE_PLUGIN_ROOT}/scripts/say-do-audit.mjs" .
     ```
     Ele lê o ledger gravado pelos hooks e comprova se a suíte de testes/build rodou com `exit code 0` após a última modificação de código. Só `VERIFIED_PASS` (exit 0) libera o gate; `UNVERIFIED_CODE_EDIT`/`FAILED_AFTER_EDIT` (exit 1) → rode/corrija os testes. `NO_EVIDENCE` (exit 2) **não é aprovação** (ledger vazio): rode o comando oficial de testes (constitution §3) e re-audite.
  3. **Curto-circuito:** com a Camada 0 falhando, não acione o validador. Com ela limpa, entregue ao validador a **saída bruta** dos dois comandos (nunca um resumo) como piso mecânico da auditoria.
- **b. Camadas 1 e 2 — Acione o subagent `sdd-validator` (100% Passivo / Read-Only)**:
  - Ele auditará o milestone inteiro lendo o código real (`arquivo:linha`) sem editar nada, entregando seu relatório dividido em:
    - **Camada 1 (Estágio 1 — Conformidade Estrita GEARS & Escopo)**: Cobertura de cada `FR`/`NFR`/`AC` e ausência de escopo inventado (*anti-scope-creep*).
    - **Camada 2 (Estágio 2 — Qualidade, Constitution e Infra Global)**: Aderência à `constitution.md`, segurança e interações com infra global (middlewares, rotas raiz, auth, banco).
- **c. Correção pelo Implementador**:
  - Achado `Critical`/`High` → tente resolver no mesmo gate via implementador SE a correção for apenas tornar o código conforme a spec já aprovada (corrija e re-rode a suíte completa). Se a correção exigir *mudar a spec* ou uma decisão de produto, você NÃO resolve sozinho: o achado só passa como **`APROVADO COM RESSALVAS`** com **Aceite de Risco do usuário** (sempre confirme antes; nunca o agente): a severidade original é mantida e a `VAL` no `10-validation.md` recebe `Risk Acceptance: <quem>, <data> — <justificativa> — revisão: <data ou gatilho>`. Falha da Camada 0 nunca é aceitável; aceitar violação da `constitution.md` exige registrar a exceção na seção 8 dela. Sem aceite → **`BLOQUEADO`**; o milestone não avança.
- **d. Registro em Duas Camadas**:
  - Registre um bloco **"Registro do gate Mn"** no ledger, logo abaixo da linha do gate: veredito + cada achado com seu desfecho. Achado **CORRIGIDO** no gate morre nesse bloco; **todo achado que fica ABERTO — qualquer severidade — também é registrado no `10-validation.md` global** como dívida ativa (ID global, campos obrigatórios do template `10-validation.md`, ponteiro cruzado ledger↔global).
- **e. Higiene de Dívida, Memória e Paginação Elástica (*Overflow Sharding*)**:
  - **Dívidas Sanadas → Cold Storage**: Se uma dívida do `10-validation.md` (ou `10-validation-02.md`) for RESOLVIDA, **MOVA** a entrada para `docs/sdd/archive/validation-log.md` (append-only) com data e o que a fechou.
  - **Rotação de Memória**: Mantenha apenas as ~5 mudanças/milestones mais recentes no `11-project-memory.md`, movendo as anteriores já consolidadas para `docs/sdd/archive/memory-history.md`.
  - **Paginação Elástica e Auto-Exclusão (`-02.md`)**:
    - Se `10-validation.md` ou `11-project-memory.md` passar de **150 linhas ou do teto de caracteres** (7.000 no memory, 16.000 no validation), crie `10-validation-02.md` ou `11-project-memory-02.md` e linke no topo do arquivo principal. Nunca resuma nem corte uma dívida para caber.
    - Se, após sanar dívidas ou rotacionar memória, os itens de um arquivo `-02.md` voltarem a caber no arquivo principal (dentro dos dois tetos), **repatrie os itens para o arquivo principal, remova o link do cabeçalho e EXCLUA o arquivo `-02.md`**.
- **f. Apresente o resultado ao usuário**: O milestone seguinte só inicia após aprovação manual dele. Nesse momento, ofereça o commit do milestone (nunca commite sem pedido explícito).

---

Se surgir necessidade de mudar a spec durante a implementação → PARE e use `/sdd-workflow:change`. Código nunca diverge da spec silenciosamente. Exceção controlada: divergência que apenas RESTRINGE o design ou documenta uma decisão local (sem mudar comportamento/escopo prometido) pode ser resolvida com **nota de emenda datada** no ponto exato do artefato, aprovada explicitamente pelo usuário no turno (nunca pelo próprio agente ou pelo orquestrador) — nunca edição silenciosa. Toda emenda datada carrega o ponteiro `→ reconciliar no próximo /change ou archive desta área`.

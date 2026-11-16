---
name: implement
description: Executa uma task do ledger SDD com Plan Mode e aciona ao final de cada milestone o Quality Gate 100% Passivo em 3 Camadas.
---

# SDD — Implement (Execução Guiada & Gate Passivo em 3 Camadas — v2.1)

1. **Protocolo de sessão**: `constitution.md` → `11-project-memory.md` → `10-validation.md` → ledger ativo:
   - **Baseline (greenfield)**: `docs/sdd/07-tasks.md`.
   - **Mudança ativa**: o memory indica qual change está em apply → leia APENAS `docs/sdd/changes/<ativa>/tasks.md` (verifique também se há avisos de arquivos paginados `-02.md`).
2. **Selecione a task**: a `In Progress` existente, ou a primeira `Pending` sem dependências bloqueadas. Confirme com o usuário em 1 linha.
3. **Gate de entrada**: task tem `Related Requirements` e `Done When`? Achados `Critical`/`High` abertos? Se sim → pare e reporte.
4. **Git & Execução**: feature → branch (conforme constitution). Marque `Status: In Progress` no ledger **antes** de tocar no código e delegue ao subagent **`sdd-implementer`** (que usará Plan Mode em tasks não triviais).
5. **Gate de saída da task (Evidência para o Say-Do Gate)**:
   - O implementador deve rodar a suíte de testes no terminal após a última edição de código e comprovar `exit code 0`.
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
  2. Confirme que a suíte de testes/build foi executada com `exit code 0` após a última modificação de código (*Say-Do Check*). Entregue ambas as evidências ao validador como piso mecânico da auditoria.
- **b. Camadas 1 e 2 — Acione o subagent `sdd-validator` (100% Passivo / Read-Only)**:
  - Ele auditará o milestone inteiro lendo o código real (`arquivo:linha`) sem editar nada, entregando seu relatório dividido em:
    - **Camada 1 (Estágio 1 — Conformidade Estrita GEARS & Escopo)**: Cobertura de cada `FR`/`NFR`/`AC` e ausência de escopo inventado (*anti-scope-creep*).
    - **Camada 2 (Estágio 2 — Qualidade, Constitution e Infra Global)**: Aderência à `constitution.md`, segurança e interações com infra global (middlewares, rotas raiz, auth, banco).
- **c. Correção pelo Implementador**:
  - Achado `Critical`/`High` → tente resolver no mesmo gate via implementador SE a correção for apenas tornar o código conforme a spec já aprovada (corrija e re-rode a suíte completa). Se a correção exigir *mudar a spec* ou uma decisão de produto, você NÃO resolve sozinho: o achado só pode passar como **`APROVADO COM RESSALVAS`** mediante aceite **EXPLÍCITO** do usuário (sempre confirme antes) e é registrado como dívida ativa no `10-validation.md` global. Sem aceite → **`BLOQUEADO`**; o milestone não avança.
- **d. Registro em Duas Camadas**:
  - Registre um bloco **"Registro do gate Mn"** no ledger, logo abaixo da linha do gate: veredito + cada achado com seu desfecho. Achado **CORRIGIDO** no gate morre nesse bloco; **todo achado que fica ABERTO — qualquer severidade — também é registrado no `10-validation.md` global** como dívida ativa (ID global, 1–2 parágrafos curtos de contexto, ponteiro cruzado ledger↔global).
- **e. Higiene de Dívida, Memória e Paginação Elástica (*Overflow Sharding*)**:
  - **Dívidas Sanadas → Cold Storage**: Se uma dívida do `10-validation.md` (ou `10-validation-02.md`) for RESOLVIDA, **MOVA** a entrada para `docs/sdd/archive/validation-log.md` (append-only) com data e o que a fechou.
  - **Rotação de Memória**: Mantenha apenas as ~5 mudanças/milestones mais recentes no `11-project-memory.md`, movendo as anteriores já consolidadas para `docs/sdd/archive/memory-history.md`.
  - **Paginação Elástica e Auto-Exclusão (`-02.md`)**:
    - Se `10-validation.md` ou `11-project-memory.md` ultrapassar **150 linhas** (mantendo parágrafos curtos de até 4–5 linhas), crie `10-validation-02.md` ou `11-project-memory-02.md` e linke no topo do arquivo principal.
    - Se, após sanar dívidas ou rotacionar memória, os itens de um arquivo `-02.md` voltarem a caber dentro das 150 linhas do arquivo principal, **repatrie os itens para o arquivo principal, remova o link do cabeçalho e EXCLUA o arquivo `-02.md`**.
- **f. Apresente o resultado ao usuário**: O milestone seguinte só inicia após aprovação manual dele. Nesse momento, ofereça o commit do milestone (nunca commite sem pedido explícito).

---

Se surgir necessidade de mudar a spec durante a implementação → PARE e use `/sdd-workflow:change`. Código nunca diverge da spec silenciosamente. Exceção controlada: divergência que apenas RESTRINGE o design ou documenta uma decisão local (sem mudar comportamento/escopo prometido) pode ser resolvida com **nota de emenda datada** no ponto exato do artefato, aprovada no turno — nunca edição silenciosa. Toda emenda datada carrega o ponteiro `→ reconciliar no próximo /change ou archive desta área`.

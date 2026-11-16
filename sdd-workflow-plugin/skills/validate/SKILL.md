---
name: validate
description: Aciona o Quality Gate 100% Passivo em 3 Camadas (Camada 0 Mecânica: check-ids + comprovação de testes; Camada 1: Spec Compliance GEARS; Camada 2: Code & Global Infra Quality).
---

# SDD — Validate (Quality Gate 100% Passivo em 3 Camadas — v2.1)

Skill responsável por executar a auditoria completa de qualidade do projeto ou milestone sob demanda.

> **Princípio de Passividade Estrita:** Nenhuma das 3 camadas do Gate altera código de produção nem edita especificações. O gate é 100% `read-only` durante a inspeção: ele levanta provas mecânicas e estáticas e entrega a lista de divergências (`VAL-xxx`) para que o implementador execute as correções ou o orquestrador registre as dívidas ativas aceitas pelo usuário.

## Passos:

### 1. Camada 0 — Piso Mecânico Passivo
1. **Guarda de Identificadores (`check-ids.mjs`)**:
   - Execute na raiz do projeto:
     ```bash
     node "${CLAUDE_PLUGIN_ROOT}/scripts/check-ids.mjs" .
     ```
   - Verifica se todos os IDs citados no código e nos documentos possuem declaração válida em `docs/sdd/` (incluindo arquivos paginados `-02.md` e `archive/validation-log.md`).
2. **Comprovação de Execução (*Say-Do Gate* — `say-do-audit.mjs`)**:
   - Execute na raiz do projeto:
     ```bash
     node "${CLAUDE_PLUGIN_ROOT}/scripts/say-do-audit.mjs" .
     ```
   - Ele lê o ledger gravado pelos hooks `PostToolUse`/`PostToolUseFailure` e comprova se a suíte de testes/build rodou com `exit code 0` após a última modificação de arquivo de código.
   - Status: `VERIFIED_PASS` (aprovado) · `FAILED_AFTER_EDIT` · `UNVERIFIED_CODE_EDIT` · `NO_EVIDENCE`. **`NO_EVIDENCE` não é aprovação**: rode o comando oficial de testes (constitution §3) e re-audite.

> **Curto-circuito obrigatório:** se a Camada 0 falhar (siglas órfãs ou Say-Do diferente de `VERIFIED_PASS`), **PARE aqui**. Reporte ao implementador e **não acione o `sdd-validator`** até o piso mecânico estar limpo.

### 2. Camadas 1 e 2 — Auditoria pelo Subagente `sdd-validator`
3. Com a Camada 0 limpa, invoque o subagent **`sdd-validator`** (100% `read-only`), passando a **saída bruta** dos dois comandos da Camada 0 (nunca um resumo). Ele analisará o código real (`arquivo:linha`) e entregará o relatório dividido em:
   - **Estágio 1 — Conformidade Estrita GEARS (`Spec Compliance`)**: Confronto cláusula a cláusula (`Where / While / When / shall` e `AC-xxx`) + verificação contra invenção de escopo (*anti-scope-creep*).
   - **Estágio 2 — Qualidade, Constitution e Infra Global (`Code & Infra Quality`)**: Aderência à `constitution.md`, segurança e interações com infraestrutura global da aplicação.

### 3. Desfecho, Registro de Dívidas e Paginação Elástica (*Overflow Sharding*)
4. Se houver achados `Critical`/`High`, marque a tarefa no `07-tasks.md` como bloqueada (ou corrija o código via `sdd-implementer` se for desvio simples contra a spec aprovada) e avise o usuário que o milestone não pode avançar sem correção.
   - Se o achado só se resolve mudando a spec ou uma decisão de produto, ele só passa com **Aceite de Risco do usuário** (nunca do agente): a severidade original é mantida e a `VAL` recebe `Risk Acceptance` (quem, data, justificativa, gatilho de revisão) e `Status: Accepted`. Falha da Camada 0 nunca é aceitável; aceitar violação da `constitution.md` exige registrar a exceção na seção 8 dela.
5. Pegue as falhas que permanecerem **ABERTAS** após o gate (qualquer severidade) e registre em `docs/sdd/10-validation.md`:
   - Preencha os campos obrigatórios do template (`Issue`, `Evidence`, `Impact`, `Recommendation`, `Closure Criteria`, `History`); nunca resuma uma dívida para caber — fragmente em `VAL` filhas (`Parent:`) quando ela tiver frentes independentes.
   - Se o arquivo passar de 150 linhas ou 16.000 caracteres, crie/atualize `docs/sdd/10-validation-02.md` nos mesmos moldes e mantenha o link no cabeçalho de `10-validation.md`.
   - Se dívidas antigas foram sanadas neste ciclo, mova-as para `docs/sdd/archive/validation-log.md` e, caso `10-validation-02.md` não seja mais necessário (tudo caiba de volta em `10-validation.md`), consolide no arquivo principal e **exclua o arquivo `-02.md`**.

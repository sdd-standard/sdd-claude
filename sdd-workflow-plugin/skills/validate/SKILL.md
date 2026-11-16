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
2. **Comprovação de Execução (*Say-Do Check*)**:
   - Verifique que a suíte de testes/build foi executada na sessão com `exit code 0` após a última modificação de arquivo de código.

### 2. Camadas 1 e 2 — Auditoria pelo Subagente `sdd-validator`
3. Invoque o subagent **`sdd-validator`** (100% `read-only`), passando a evidência da Camada 0. Ele analisará o código real (`arquivo:linha`) e entregará o relatório dividido em:
   - **Estágio 1 — Conformidade Estrita GEARS (`Spec Compliance`)**: Confronto cláusula a cláusula (`Where / While / When / shall` e `AC-xxx`) + verificação contra invenção de escopo (*anti-scope-creep*).
   - **Estágio 2 — Qualidade, Constitution e Infra Global (`Code & Infra Quality`)**: Aderência à `constitution.md`, segurança e interações com infraestrutura global da aplicação.

### 3. Desfecho, Registro de Dívidas e Paginação Elástica (*Overflow Sharding*)
4. Se houver falhas na Camada 0 ou achados `Critical`/`High`, marque a tarefa no `07-tasks.md` como bloqueada (ou corrija o código via `sdd-implementer` se for desvio simples contra a spec aprovada) e avise o usuário que o milestone não pode avançar sem correção ou aprovação explícita.
5. Pegue as falhas que permanecerem **ABERTAS** após o gate (qualquer severidade) e registre em `docs/sdd/10-validation.md`:
   - Respeite o teto de **150 linhas por arquivo** e **máximo de 4 a 5 linhas por parágrafo**.
   - Se ultrapassar 150 linhas, crie/atualize `docs/sdd/10-validation-02.md` nos mesmos moldes e mantenha o link no cabeçalho de `10-validation.md`.
   - Se dívidas antigas foram sanadas neste ciclo, mova-as para `docs/sdd/archive/validation-log.md` e, caso `10-validation-02.md` não seja mais necessário (tudo caiba de volta em `10-validation.md`), consolide no arquivo principal e **exclua o arquivo `-02.md`**.

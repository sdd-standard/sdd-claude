---
name: tasks
description: Fase de decomposição SDD (07→10) — Tasks, Acceptance e Traceability a partir do design aprovado. Use após o design estar aprovado.
---

# SDD — Tasks (Fases 07 a 10 — v2.1)

Pré-condição: `05-design.md` `Reviewed`/`Approved`. Se a base estiver só em `Reviewed`, registre antes a dívida de maturidade (`Type: Maturity`, com snapshot dos IDs e do texto consumidos) no `10-validation.md`; o `Status` dos artefatos só muda por decisão do usuário.

Delegue ao subagent **`sdd-architect`**. Fluxo:

1. **`07-tasks.md`** — tasks atômicas (≤ ~1 dia), agrupadas por milestone: `ID`, `Title`, `Goal`, `Inputs`, `Related Requirements`, `Done When`, `Recommended Agent`, **`Status: Pending`**, `Dependencies`.
2. **`08-acceptance.md`** — `AC-xxx` em `Given/When/Then` derivados dos GEARS, com casos negativos e de borda; todo `AC` aponta para um `FR`/`NFR`. Formato de declaração (lido pelo `check-ids.mjs`): o ID fica **sozinho na linha** (ou seguido de ` — título`) e o requisito coberto vai no campo `Requirement: FR-xxx` — nunca entre parênteses na linha do ID.
3. **`09-traceability.md`** — tabela `Intent → FR → DES → TASK → AC`; lacunas listadas explicitamente.
4. **Verificação mecânica ANTES do gate**:
   - Toda task tem os 9 campos, incluindo `Status: Pending`? Conte os cabeçalhos de task (linhas que COMEÇAM com `TASK-`) e as linhas que COMEÇAM com `Status:`; os dois números têm de bater. Ao contar, IGNORE três fontes de falso positivo: a linha-legenda do topo do arquivo (`Status: Pending | In Progress | ...`), o bloco `"Registro do gate"` e qualquer conteúdo dentro de cercas de código ```` ``` ```` — snippets, exemplos e blocos de teste podem conter `Status:` ou `TASK-` que NÃO são tasks reais. Divergência entre as contagens = task sem Status, o motivo mais comum de reprovação do gate.
   - Execute também `node "${CLAUDE_PLUGIN_ROOT}/scripts/check-ids.mjs" .` para confirmar zero siglas órfãs.
5. **`10-validation.md`** — consolide achados (respeitando o gatilho de paginação (150 linhas ou 16.000 caracteres) e paginação elástica `10-validation-02.md`); rode **`sdd-validator`** (passivo) para o gate final pré-implementação.
6. Atualize `docs/sdd/11-project-memory.md` com a primeira task.

Nenhuma implementação começa com achados `Critical`/`High` abertos.

---
name: tasks
description: Fase de decomposição SDD (07→10) — Tasks, Acceptance e Traceability a partir do design aprovado. Use após o design estar aprovado.
---

# SDD — Tasks (Fases 07 a 10 — v2.1)

Pré-condição: `05-design.md` `Reviewed`/`Approved`.

Delegue ao subagent **`sdd-architect`**. Fluxo:

1. **`07-tasks.md`** — tasks atômicas (≤ ~1 dia), agrupadas por milestone: `ID`, `Title`, `Goal`, `Inputs`, `Related Requirements`, `Done When`, `Recommended Agent`, **`Status: Pending`**, `Dependencies`.
2. **`08-acceptance.md`** — `AC-xxx` em `Given/When/Then` derivados dos GEARS, com casos negativos e de borda; todo `AC` aponta para um `FR`/`NFR`.
3. **`09-traceability.md`** — tabela `Intent → FR → DES → TASK → AC`; lacunas listadas explicitamente.
4. **Verificação mecânica ANTES do gate**:
   - Toda task tem os 9 campos, incluindo `Status: Pending`? Conte os cabeçalhos de task (linhas que COMEÇAM com `TASK-`) e as linhas que COMEÇAM com `Status:`; os dois números têm de bater. Ao contar, IGNORE três fontes de falso positivo: a linha-legenda do topo do arquivo (`Status: Pending | In Progress | ...`), o bloco `"Registro do gate"` e qualquer conteúdo dentro de cercas de código ```` ``` ```` — snippets, exemplos e blocos de teste podem conter `Status:` ou `TASK-` que NÃO são tasks reais. Divergência entre as contagens = task sem Status, o motivo mais comum de reprovação do gate.
   - Execute também `node "${CLAUDE_PLUGIN_ROOT}/scripts/check-ids.mjs" .` para confirmar zero siglas órfãs.
5. **`10-validation.md`** — consolide achados (respeitando o teto de 150 linhas e paginação elástica `10-validation-02.md`); rode **`sdd-validator`** (passivo) para o gate final pré-implementação.
6. Atualize `docs/sdd/11-project-memory.md` com a primeira task.

Nenhuma implementação começa com achados `Critical`/`High` abertos.

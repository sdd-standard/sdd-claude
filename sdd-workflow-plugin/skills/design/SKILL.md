---
name: design
description: Fase de design SDD (04→06) — Diagnóstico Validate-Gap, Domain Model (DDD), Design técnico (DES-xxx) e Roadmap a partir dos requisitos aprovados.
---

# SDD — Design (Fases 04 a 06 — v2.1)

Pré-condição: `02-spec.md` e `03-requirements.md` `Reviewed`/`Approved`. Se não, volte ao `/sdd-workflow:specify`. Se a base estiver só em `Reviewed`, registre antes a dívida de maturidade (`Type: Maturity`, com snapshot dos IDs e do texto consumidos) no `10-validation.md`; o `Status` dos artefatos só muda por decisão do usuário.

Delegue ao subagent **`sdd-architect`**. Fluxo:

1. **Diagnóstico Pré-Design Escopado (`Validate-Gap`)**:
   - Se o projeto já possuir código existente no módulo/domínio afetado, inspecione **apenas os arquivos daquele domínio** (jamais o repositório inteiro).
   - Compare o estado atual (*as-built*) com os novos requisitos GEARS (*to-be*), listando brevemente o que será reaproveitado, o que muda e possíveis colisões de contrato ou schema.
2. **Entrevista de Trade-offs de Baixa Fricção**:
   - Quando houver mais de um caminho arquitetural relevante, apresente ao usuário em poucas linhas com uma **opção recomendada** clara antes de travar a decisão.
3. **Geração dos Artefatos**:
   - **`04-domain-model.md`** — *bounded contexts*, entidades, agregados, VOs, eventos, invariantes, linguagem ubíqua. ACLs entre contextos quando houver modelo externo.
   - **`05-design.md`** — arquitetura, componentes, decisões `DES-xxx` (cada uma com `Related Requirements` e `Rationale`), segurança, observabilidade, riscos, trade-offs. Valide contra a `constitution.md`.
   - **`06-roadmap.md`** — MVP, milestones, dependências, critérios de avanço.
4. **Gate Passivo e Memória**:
   - Rode gate com o subagent **`sdd-validator`** (100% passivo / `read-only`) após cada artefato e atualize `docs/sdd/11-project-memory.md` (respeitando o gatilho de paginação (150 linhas ou 7.000 caracteres) e paginação elástica `-02.md`).

Regra: requisito diz **O QUE**, design diz **COMO**. Nunca contamine `03-requirements.md` com decisões de implementação.

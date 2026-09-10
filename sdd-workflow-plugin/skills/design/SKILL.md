---
name: design
description: Fase de design SDD — Domain Model (DDD), Design técnico e Roadmap a partir dos requisitos aprovados. Use após o specify estar aprovado.
---

# SDD — Design (fases 04 a 06)

Pré-condição: 02-spec.md e 03-requirements.md Reviewed/Approved. Se não, volte ao /sdd-workflow:specify.

Delegue ao subagent **sdd-architect**. Fluxo:

1. 04-domain-model.md — bounded contexts, entidades, agregados, VOs, eventos, invariantes, linguagem ubíqua. ACLs entre contextos quando houver modelo externo.
2. 05-design.md — arquitetura, componentes, decisões DES-xxx (cada uma com Related Requirements e Rationale), segurança, observabilidade, riscos, trade-offs. Valide contra a constitution.
3. 06-roadmap.md — MVP, milestones, dependências, critérios de avanço.
4. Gate com **sdd-validator** após cada artefato. Atualize 11-project-memory.md.

Regra: requisito diz O QUE, design diz COMO. Nunca contamine 03-requirements com decisões de implementação.

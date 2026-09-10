---
name: change
description: Ciclo de mudança SDD pós-baseline com delta specs (proposal → apply → archive). Use para nova feature, mudança de requisito, correção ou qualquer alteração em projeto com baseline SDD.
---

# SDD — Change (delta specs)

Nunca edite docs/sdd/specs/ diretamente após o baseline. Fluxo:

1. **Proposal** — docs/sdd/changes/<kebab-name>/proposal.md (template no plugin): Why, What, Scope (in/out), Success Criteria, artefatos impactados. Revise com o usuário.
2. **Delta spec** — delta-spec.md com seções ADDED / MODIFIED / REMOVED contendo apenas os requisitos GEARS e decisões que mudam. Em brownfield, se a área tocada nunca foi especificada, o delta ADDED inclui a spec "as-built" mínima daquela área (spec-on-touch).
3. **Tasks** — tasks.md da mudança, mesmo formato do ledger (com Status).
4. Gate: **sdd-validator** confere o delta contra constitution e rastreabilidade.
5. **Apply** — implemente via /sdd-workflow:implement usando as tasks da mudança.
6. **Archive** — consolide o delta nos artefatos de docs/sdd/specs/ (incluindo 09-traceability.md), mova a pasta para docs/sdd/archive/ e atualize 11-project-memory.md. Se a mudança nasceu de dívidas do 10-validation.md (ou fechou alguma), MOVA essas entradas para docs/sdd/archive/validation-log.md com "Fechado por: /change <nome>" — o 10-validation fica só com o que continua ativo.

Hotfix emergencial: pode pular o delta, mas registre em 11-project-memory.md e confira se a spec continua verdadeira; se não, crie a mudança retroativa.

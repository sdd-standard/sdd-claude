---
name: specify
description: Fase de especificação SDD — conduz Project Brief, Discovery, Spec (Intent Blocks) e Requirements (GEARS). Use ao iniciar um projeto/feature grande ou quando o usuário pedir para especificar algo.
---

# SDD — Specify (fases 00 a 03)

Delegue o trabalho ao subagent **sdd-architect**. Fluxo:

1. Leia constitution.md (se não existir, rode antes /sdd-workflow:init ou :adopt), 11-project-memory.md e o estado dos artefatos 00–03.
2. Conduza a fase mais antiga incompleta, nesta ordem: 00-project-brief → 01-discovery → 02-spec → 03-requirements.
3. Em cada fase: resuma entendimento → liste lacunas → faça perguntas de descoberta (segurança, LGPD, NFRs, RTO/RPO sempre) → gere o artefato em docs/sdd/.
4. UM artefato por vez; valide com o usuário antes de avançar (Draft → Reviewed → Approved).
5. Ao concluir cada artefato: rode o subagent **sdd-validator** (gate) e atualize 11-project-memory.md.

Regras: Intent Blocks no 02-spec; GEARS no 03-requirements (keywords Where/While/When/shall em inglês); lacunas críticas → PENDENTE DE DEFINIÇÃO + 10-validation.md. Nunca gere código nesta fase.

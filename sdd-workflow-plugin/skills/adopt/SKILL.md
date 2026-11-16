---
name: adopt
description: Adota SDD em projeto EXISTENTE (brownfield) — extrai constitution das convenções reais, gera baseline mínima "as-built" na estrutura flat docs/sdd/ e prepara o fluxo Spec-on-Touch.
---

# SDD — Adopt (Brownfield — v2.1)

> **Princípio de Ouro Brownfield:** **NÃO faça retro-spec nem leia o código legado inteiro.** Crie apenas a baseline estrutural mínima (*As-Built*) + **Spec-on-Touch** (a especificação cresce incrementalmente apenas nas áreas tocadas por novas mudanças via `/sdd-workflow:change`).

## Fase 1 — Levantamento Estrutural Leve (delegue ao subagent `sdd-architect`)

1. Escaneie apenas os manifestos e configurações da raiz (`package.json`, `.sln`, `pyproject.toml`, estrutura de pastas de 1º/2º nível, frameworks, testes existentes, CI).
2. Identifique os macro-módulos/*bounded contexts* aparentes e integrações externas.
3. Liste em até 3 a 5 perguntas diretas (com recomendação padrão) apenas o que NÃO dá para inferir dos manifestos (SLAs, regras de negócio implícitas, decisões históricas).

## Fase 2 — Constitution Extraída + Entrevista

4. Gere `docs/sdd/constitution.md` em duas partes: (a) convenções OBSERVADAS no código (stack, padrões, testes) — confirme com o usuário; (b) regras DESEJADAS daqui em diante (entrevista enxuta: qualidade, segurança, git flow, deps, comando oficial de testes usado pelo *Say-Do Gate*); (c) **Calibração de criticidade do domínio** (seção 6): o que, neste negócio, eleva um achado automaticamente para `Critical` ou `High` (ex.: precisão financeira, PII/LGPD, auditoria regulatória) e o que é tolerado como `Medium`/`Low` nesta fase.

## Fase 3 — Baseline Mínima "As-Built" (Estrutura Flat em `docs/sdd/`)

5. Crie em `docs/sdd/` utilizando os modelos de `${CLAUDE_PLUGIN_ROOT}/templates/specs/` e `templates/archive/`:
   - `00-project-brief.md` — o que o sistema é hoje e por que existe.
   - `02-spec.md` — capacidades atuais em alto nível (sem GEARS retroativo; seção `"As-Built"`).
   - `04-domain-model.md` — mapa dos *bounded contexts* e linguagem ubíqua observada.
   - `05-design.md` — arquitetura *as-built* + decisões conhecidas (marque históricas como `"legado"`).
   - `07-tasks.md` vazio (ledger) + `10-validation.md` com lacunas conhecidas (com suporte a paginação elástica `10-validation-02.md` ao atingir o gatilho de paginação) + `11-project-memory.md` (a partir de `templates/specs/11-project-memory.md`, com suporte a paginação elástica `11-project-memory-02.md`).
   - `changes/` vazio + `archive/validation-log.md` e `archive/memory-history.md` (dos templates em `templates/archive/`, vazios).
   - **NÃO** crie `01`, `03`, `06`, `08`, `09` retroativos — serão criados por mudança, quando necessário.
6. Gere/atualize `CLAUDE.md` na raiz (`templates/CLAUDE.md.template`), sem sobrescrever regras existentes do usuário.

## Fase 4 — Operação Contínua

7. A partir daqui, TODA feature/alteração entra via `/sdd-workflow:change` (Delta Specs com inspeção escopada apenas ao domínio tocado). Cada delta consolidado enriquece as specs.
8. Feature grande demais para um delta? Use `/sdd-workflow:specify` escopado àquela feature (ou fatie em múltiplas changes sequenciais).

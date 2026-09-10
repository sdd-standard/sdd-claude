---
name: adopt
description: Adota SDD em projeto EXISTENTE (brownfield) — extrai constitution das convenções reais, gera baseline mínima "as-built" e prepara o fluxo de delta specs. Use em codebases grandes que passarão a usar SDD para novas features.
---

# SDD — Adopt (brownfield)

Princípio: NÃO faça retro-spec do sistema inteiro. Baseline mínima + spec-on-touch: a especificação cresce incrementalmente, apenas nas áreas tocadas por mudanças.

## Fase 1 — Levantamento (delegue ao subagent sdd-architect)

1. Escaneie o repositório: manifests (package.json/.sln/etc.), estrutura de pastas, frameworks, testes existentes, CI, convenções de código observáveis.
2. Identifique os macro-módulos/bounded contexts aparentes e integrações externas.
3. Liste o que NÃO dá para inferir (SLAs, regras de negócio implícitas, decisões históricas) como perguntas ao usuário.

## Fase 2 — Constitution extraída + entrevista

4. Gere docs/sdd/constitution.md em duas partes: (a) convenções OBSERVADAS no código (stack, padrões, testes) — confirme com o usuário; (b) regras DESEJADAS daqui em diante (entrevista: qualidade, segurança, git flow, deps).

## Fase 3 — Baseline mínima "as-built"

5. Crie apenas:
   - 00-project-brief.md — o que o sistema é hoje e por que existe.
   - 02-spec.md — capacidades atuais em alto nível (sem GEARS retroativo; seção "As-Built").
   - 04-domain-model.md — mapa dos bounded contexts e linguagem ubíqua observada.
   - 05-design.md — arquitetura as-built + decisões conhecidas (marque históricas como "legado").
   - 07-tasks.md vazio (ledger) + 10-validation.md com lacunas conhecidas + 11-project-memory.md + archive/validation-log.md (do template, vazio).
   - NÃO crie 01, 03, 06, 08, 09 retroativos — serão criados por mudança, quando necessário.
6. Gere/atualize CLAUDE.md na raiz (template do plugin), sem sobrescrever regras existentes do usuário.

## Fase 4 — Operação

7. A partir daqui, TODA feature/alteração entra via /sdd-workflow:change (delta specs). Cada delta consolidado enriquece as specs — em 6 meses as áreas ativas do sistema estarão especificadas, e as áreas mortas não desperdiçaram esforço.
8. Feature grande demais para um delta? Use /sdd-workflow:specify escopado àquela feature (cria requisitos GEARS completos só para ela).

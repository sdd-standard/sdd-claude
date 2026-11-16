# Changelog

All notable changes to sdd-claude will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.5.0] - 2026-11-15

### Added
- **Pure SDD Standard v2.1 alignment**:
  - **Skill `/sdd-workflow:validate` (`skills/validate/SKILL.md`)**: New standalone command to trigger the 3-Layer 100% Passive Quality Gate on demand, matching `sdd-antigravity` and `sdd-hermes`.
  - **Pre-Design `Validate-Gap` Check (`DÍVIDA-SDD-02`)**: Integrated into `design` and `change` skills for brownfield domain comparison before creating `DES-xxx` decisions.
  - **3-Layer 100% Passive Quality Gate (`DÍVIDA-SDD-01` & `DÍVIDA-SDD-03`)**: Unified milestone gate combining Layer 0 mechanical checks (`check-ids.mjs` + test execution proof) with a two-stage passive `sdd-validator` report (`Stage 1: Strict GEARS & Scope Compliance` → `Stage 2: Constitution, Security & Global Infra Quality`).
  - **Scoped Low-Friction Interview & Proactive Scope Slicing (`DÍVIDA-SDD-05`)**: `sdd-architect`, `specify`, and `change` restrict code reading strictly to the touched domain, ask at most 3–5 focused questions with recommended defaults, and proactively propose splitting or narrowing oversized changes.
  - **Elastic Pagination with Auto-Compaction (`-02.md` — `DÍVIDA-SDD-06`)**: Enforces the 150-line file cap + 4–5 line paragraph density limit while supporting `10-validation-02.md` and `11-project-memory-02.md` overflow shards that are automatically detected by `hooks/session-start.mjs`, linked in the main header, and deleted once debts/active fronts are resolved.
  - **Deterministic Severity Taxonomy & Domain Calibration (`DÍVIDA-SDD-07`)**: Embeds the Universal SDD Severity Matrix (`Critical | High | Medium | Low`) inline in `CLAUDE.md.template`, `agents/sdd-validator.md`, and `templates/specs/10-validation.md`, paired with project-specific risk calibration in `templates/constitution.md.template`.

### Changed
- **Unified `templates/specs/00..11` folder**: Moved `templates/11-project-memory.md` into `templates/specs/11-project-memory.md` so all 12 numbered canonical artifacts reside together and map cleanly in a single copy operation to the flat `docs/sdd/` directory.
- `plugin.json` version bumped to `1.5.0`.

## [1.4.0] - 2026-09-17

### Changed
- **Canonical flat structure**: All references to `docs/sdd/specs/` replaced with `docs/sdd/` (flat). Templates are now copied directly to `docs/sdd/` during `init`, not to a `specs/` subfolder.
- **`session-start.mjs`**: Fixed tasks path from `docs/sdd/specs/07-tasks.md` to `docs/sdd/07-tasks.md`.
- **`skills/change/SKILL.md`**: Expanded from 18 to ~40 lines with full 3-state lifecycle (`proposal` → `apply` → `archive`), dynamic task discovery rules, consolidation steps, and debt hygiene.
- **`skills/specify/SKILL.md`**: Artifacts generated in `docs/sdd/` (flat).
- **`skills/init/SKILL.md`**: Templates copied to `docs/sdd/` (flat). Added `archive/memory-history.md` to initialization.
- **`agents/sdd-implementer.md`**: Task ledger path corrected to `docs/sdd/07-tasks.md`.
- **`templates/CLAUDE.md.template`**: Updated file map to reflect flat structure.

### Added
- **`templates/archive/memory-history.md`**: New append-only cold storage template for finalized change summaries rotated out of `11-project-memory.md`.
- Memory rotation rule in `11-project-memory.md` template: keep ~5 most recent changes, rotate older ones to `archive/memory-history.md`.

## [1.3.0] - 2026-09-10

### Changed
- `CLAUDE.md.template` updated with P1–P11 principles inline and canonical Hall link.
- `sdd-architect.md` enriched with GEARS semantic definitions (`Where` static, `While` runtime, `When` trigger).
- `sdd-validator.md` enriched with anti-recurrence rule and structured output format.
- `skills/change/SKILL.md` updated with canonical GEARS syntax and spec-on-touch for brownfield.
- Root `README.md` rewritten with links to the Hall and marketplace installation instructions.
- Git history reset for clean start under `sdd-standard` organization.

## [1.0.0] - 2026-09-01

### Added
- Initial release with 7 skills: `init`, `adopt`, `specify`, `design`, `tasks`, `implement`, `change`.
- 4 subagents: `sdd-architect` (opus), `sdd-implementer` (sonnet), `sdd-validator` (sonnet, read-only), `sdd-doc-writer` (haiku).
- Session-start hook injecting project memory and task status.
- Guard-install hook for dependency confirmation.
- `check-ids.mjs` mechanical ID guard.
- Full template suite: Constitution, CLAUDE.md, Specs 00–10, delta-spec, proposal, memory.
- MIT License.

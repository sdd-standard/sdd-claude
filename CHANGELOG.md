# Changelog

All notable changes to sdd-claude will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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

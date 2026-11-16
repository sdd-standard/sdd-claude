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

### Fixed (post-release audit)
- **Mechanical Say-Do Gate (`DÍVIDA-SDD-01`)**: The gate was only declarative. Added `hooks/say-do-record.mjs` (`PostToolUse` + `PostToolUseFailure`, also fired inside subagents) feeding a per-project ledger in the OS temp folder, and `scripts/say-do-audit.mjs` + `scripts/say-do-lib.mjs` to audit it. Fail-closed: only `VERIFIED_PASS` clears Layer 0; `NO_EVIDENCE`, undetermined exit codes and masked test commands (`|| true`, pipes, dry-run flags) are never a pass.
- **Removed the "emergency hotfix" bypass** from `skills/change`: every post-baseline change, however small or urgent, goes through `proposal → apply → archive`.
- **`check-ids` vs. templates**: `templates/specs/08-acceptance.md` declared `AC-001 (FR-001)`, a format the ID guard never recognised as a declaration, and `09-traceability.md` cited concrete IDs; a freshly initialised project failed Layer 0 with 3 orphans. The AC ID now stands alone with a `Requirement:` field and the matrix row uses placeholders.
- **Layer 0 short-circuit**: `validate`, `change` (archive) and the `sdd-validator` prompt no longer invoke Stages 1–2 over a failing mechanical floor, and the validator requires the raw output of both Layer 0 commands.
- **`session-start` hook**: accepts both the canonical ledger format and the Markdown variant (`### TASK-001` / `- **Status:**`), no longer lists the ledger legend as a task, and warns when `11-project-memory.md` or `10-validation.md` exceed 150 lines.
- **Constitution interview** (`init`, `adopt`) now asks for the domain criticality calibration (section 6) and the official test command.
- Dated amendment notes require explicit **user** approval; baseline immutability wording unified to `00–06`, `08`, `09` (volatile `07`, `10`, `11` exempt); `change` headings relabelled to the 3 canonical states; `guard-install` pattern aligned with `sdd-hermes` (`pip3`, `uv`, `cargo add`, `poetry add`, `go get`, `composer require`, `gem install`).
- **Maturity lifecycle enforced (`Draft → Reviewed → Approved`)**: only the user promotes an artifact (batch approval allowed); consuming a `Reviewed` artifact that is not yet `Approved` records a maturity debt (`Type: Maturity`) with a snapshot of the consumed IDs and clause text, closed unchanged or after revalidating the dependents; item-level `Auto-Approved` allowed only for items that do not touch constitution sections 4 and 6, derive 1:1 from a user-approved item (or apply a written convention) and carry a `Motivo:` line. Specify, design, tasks and change skills, the rules and the `sdd-validator` checklist were updated (`Auto-Approved` outside the criteria is `High`).
- **User Risk Acceptance formalized**: a `Critical`/`High` debt stops blocking only with a user acceptance recorded in the `VAL` (who, date, rationale, review trigger); the severity is kept, Layer 0 failures cannot be accepted, and accepting a constitution violation requires an entry in the new constitution section 8 (*Exceções vigentes*). The `implement` entry gate now blocks only `Critical`/`High` debts **without** acceptance (it used to block accepted debts too).
- **Elastic pagination without a paragraph cap**: the unverifiable "4–5 lines per paragraph" limit was removed. The pagination trigger is now 150 lines **or** characters: 16,000 for `10-validation.md` and 7,000 for `11-project-memory.md`. The memory ceiling comes from the platform's injection budget (Claude Code replaces any hook `additionalContext` above 10,000 characters with a file path and a 2,000-character preview) minus ~3,000 characters reserved for alerts, active tasks and active changes. The session hook never relies on the platform cut: it injects by priority and, when the memory does not fit, injects only *Estado Atual*, *Próximos Passos* and *Pendências* with an explicit instruction to read the whole file. Documented in the README, the hook header and the `11-project-memory.md` template. The `10-validation.md` template defines the mandatory debt content (`Issue`, `Evidence`, `Impact`, `Recommendation`, `Closure Criteria`, `History`, plus `Type`, `Links`/`Parent`, `Risk Acceptance`), debt fragmentation and a short greppable `Status`; session hooks warn on either threshold.
- **Session hooks list active changes** (`docs/sdd/changes/<name>/`), one line each with the count of unfinished and `In Progress` tasks, flagging changes with no active task (archive likely pending).
- **Constitution template**: section numbering 1–8 declared canonical (skills and validators cite "section 6" and "section 8"); new section 8 *Exceções vigentes*; section 3 asks for the official Say-Do test command in every plugin.
- Confirmed against the Claude Code docs that `${CLAUDE_PLUGIN_ROOT}` is substituted inside plugin `SKILL.md` content, so the skills' script paths need no session injection.
- **Session protocol no longer stalls the turn**: "confirm state and next step in up to 5 lines" now adds "and proceed with the user's request in the same turn". In the Hermes runtime test a local model confirmed the state and ended the turn without acting, which in single-prompt modes means the request is never executed.
- **Runtime test on Claude Code 2.1.229 (headless `claude -p` with `--plugin-dir`, plugin cloned from GitHub)**: no code change needed. `SessionStart` injects memory, active tasks and active changes; a green `npm test` arrives via `PostToolUse` (exit 0) and a red one via `PostToolUseFailure` (`error: "Exit code 1 ..."`), giving `VERIFIED_PASS` and `FAILED_AFTER_EDIT`; the guard-install `PreToolUse` `ask` decision prevails even over an allowed `npm install` permission.

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

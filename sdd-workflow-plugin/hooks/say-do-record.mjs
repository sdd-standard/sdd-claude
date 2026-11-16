// PostToolUse / PostToolUseFailure: alimenta passivamente o ledger do Say-Do Gate.
// Nunca bloqueia nem altera a ferramenta: qualquer erro aqui é engolido (exit 0, sem saída).
//
// Contrato do Claude Code:
//   - PostToolUse só dispara quando a ferramenta conclui com SUCESSO (Bash: exit code 0).
//   - PostToolUseFailure dispara quando a ferramenta falha; para Bash, `error` começa com "Exit code N".
//   - Ambos disparam também para chamadas feitas dentro de subagentes (ex.: sdd-implementer).
import { readFileSync } from "node:fs";
import { appendEvent, findProjectRoot, terminalEvent, writeEvent } from "../scripts/say-do-lib.mjs";

const WRITE_TOOLS = new Set(["Write", "Edit", "MultiEdit", "NotebookEdit"]);

try {
  const input = JSON.parse(readFileSync(0, "utf8"));
  const root = findProjectRoot(process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd());
  if (root) { // projeto sem docs/sdd/: silencioso, custo zero
    const tool = input.tool_name ?? "";
    const failed = input.hook_event_name === "PostToolUseFailure";
    const base = { session: input.session_id ?? null, agent: input.agent_type ?? null };

    if (tool === "Bash") {
      const command = String(input.tool_input?.command ?? "");
      let exitCode = 0;
      if (failed) {
        const m = /^Exit code (-?\d+)/.exec(String(input.error ?? ""));
        exitCode = m ? Number(m[1]) : null; // falhou sem exit code legível (timeout/abort): indeterminado
      } else if (input.tool_response?.interrupted === true || input.tool_input?.run_in_background === true) {
        exitCode = null; // interrompido ou em background: o resultado real é desconhecido
      }
      if (command) appendEvent(root, { ...base, ...terminalEvent(command, exitCode) });
    } else if (WRITE_TOOLS.has(tool) && !failed) {
      const filePath = input.tool_input?.file_path ?? input.tool_input?.notebook_path ?? "";
      appendEvent(root, { ...base, ...writeEvent(filePath) });
    }
  }
} catch { /* best-effort */ }
process.exit(0);

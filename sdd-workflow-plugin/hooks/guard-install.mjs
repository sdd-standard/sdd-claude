// PreToolUse(Bash): constitution — sempre confirmar antes de instalar dependências.
import { readFileSync } from "node:fs";

let input = {};
try { input = JSON.parse(readFileSync(0, "utf8")); } catch {}
const cmd = input?.tool_input?.command ?? "";
// Mesma cobertura do guard-install do plugin sdd-hermes (__init__.py → INSTALL_PATTERN).
const installPattern = /\b(pnpm|npm|yarn|bun)\s+(add|install|i)\b(?!.*--frozen-lockfile)|\bnpx\s+\S+@|\bdotnet\s+add\s+package\b|\bpip3?\s+install\b|\buv\s+(pip\s+install|add)\b|\bcargo\s+add\b|\bpoetry\s+add\b|\bgo\s+get\b|\bcomposer\s+require\b|\bgem\s+install\b/i;

if (installPattern.test(cmd)) {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "ask",
      permissionDecisionReason: "Constitution: instalar dependências exige confirmação explícita do usuário. Confirme versão pinada e necessidade real."
    }
  }));
}
process.exit(0);

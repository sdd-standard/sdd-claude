// PreToolUse(Bash): constitution — sempre confirmar antes de instalar dependências.
import { readFileSync } from "node:fs";

let input = {};
try { input = JSON.parse(readFileSync(0, "utf8")); } catch {}
const cmd = input?.tool_input?.command ?? "";
const installPattern = /\b(pnpm|npm|yarn|bun)\s+(add|install|i)\b(?!.*--frozen-lockfile)|\bnpx\s+\S+@|\bdotnet\s+add\s+package\b|\bpip\s+install\b/;

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

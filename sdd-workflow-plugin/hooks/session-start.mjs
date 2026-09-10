// SessionStart: injeta o estado SDD do projeto no início de cada sessão.
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const read = (p) => { try { return readFileSync(resolve(root, p), "utf8"); } catch { return null; } };

if (!existsSync(resolve(root, "docs/sdd"))) process.exit(0); // projeto sem SDD: silencioso

const memory = read("docs/sdd/11-project-memory.md");
const tasks = read("docs/sdd/specs/07-tasks.md");

let out = "## Protocolo SDD — estado carregado automaticamente (plugin sdd-workflow)\n";
out += memory ? `\n${memory}\n` : "\n(11-project-memory.md ainda não existe — rode /sdd-workflow:init ou :adopt)\n";
if (tasks) {
  const active = tasks.split(/\n(?=TASK-)/).filter(b => /Status:\s*(Pending|In Progress|Blocked)/.test(b))
    .map(b => { const id = b.match(/TASK-\d+/)?.[0]; const t = b.match(/Title:\s*(.+)/)?.[1]; const s = b.match(/Status:\s*(.+)/)?.[1]; return `- ${id} [${s?.trim()}] ${t?.trim()}`; });
  out += `\n### Tasks não concluídas (${active.length})\n${active.slice(0, 15).join("\n")}\n`;
}
out += "\nSiga o protocolo: confirme estado e próximo passo em até 5 linhas antes de agir.";
console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: out } }));

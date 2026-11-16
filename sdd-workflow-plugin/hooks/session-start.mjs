// SessionStart: injeta o estado SDD do projeto no início de cada sessão.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const sddDir = resolve(root, "docs/sdd");
const read = (p) => { try { return readFileSync(resolve(root, p), "utf8"); } catch { return null; } };

if (!existsSync(sddDir)) process.exit(0); // projeto sem SDD: silencioso

const memory = read("docs/sdd/11-project-memory.md");
const tasks = read("docs/sdd/07-tasks.md");

let out = "## Protocolo SDD — estado carregado automaticamente (plugin sdd-workflow)\n";
out += memory ? `\n${memory}\n` : "\n(11-project-memory.md ainda não existe — rode /sdd-workflow:init ou :adopt)\n";

// Detecção de Paginação Elástica (Overflow Shards -02.md, -03.md)
try {
  const overflowFiles = readdirSync(sddDir)
    .filter((name) => /-0[2-9]\.md$/i.test(name))
    .sort();
  if (overflowFiles.length > 0) {
    const listStr = overflowFiles.map((f) => `\`docs/sdd/${f}\``).join(", ");
    out += `\n> **Paginação Elástica Ativa:** Existem arquivos complementares de memória/dívida (${listStr}). Consulte-os sob demanda se a tarefa atual tocar nos escopos indicados no cabeçalho principal.\n`;
  }
} catch {}

if (tasks) {
  const active = tasks.split(/\n(?=TASK-)/).filter(b => /Status:\s*(Pending|In Progress|Blocked)/i.test(b))
    .map(b => {
      const id = b.match(/TASK-[A-Za-z0-9_-]+/)?.[0] ?? "?";
      const t = b.match(/Title:\s*(.+)/)?.[1]?.trim() ?? "?";
      const s = b.match(/Status:\s*(.+)/)?.[1]?.trim() ?? "?";
      return `- ${id} [${s}] ${t}`;
    });
  if (active.length > 0) {
    out += `\n### Tasks não concluídas (${active.length})\n${active.slice(0, 15).join("\n")}\n`;
  }
}
out += "\nSiga o protocolo: confirme estado e próximo passo em até 5 linhas antes de agir.";
console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: out } }));

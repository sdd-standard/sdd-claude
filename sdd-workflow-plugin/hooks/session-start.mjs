// SessionStart: injeta o estado SDD do projeto no início de cada sessão.
//
// ORÇAMENTO DE INJEÇÃO (limitação do Claude Code, não do SDD):
// o Claude Code mede cada `additionalContext` devolvido por hook e, acima de 10.000 caracteres,
// troca o texto inteiro por um caminho de arquivo + prévia dos primeiros 2.000 caracteres, sem pedir
// ao modelo que leia o arquivo (docs: code.claude.com/docs/en/hooks). Por isso este hook nunca
// depende desse corte: monta a injeção por prioridade dentro de INJECTION_BUDGET.
//   1. alertas, tasks ativas e changes ativas (pequenos e com tamanho máximo);
//   2. a memória (`11-project-memory.md`) inteira, se couber no que sobra;
//   3. se não couber: só as seções críticas (Estado Atual, Próximos Passos, Pendências) e uma
//      instrução explícita para ler o arquivo inteiro antes de agir.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const INJECTION_BUDGET = 10000; // limite do Claude Code por additionalContext
const SAFETY_MARGIN = 300;      // folga para o envelope JSON/cabeçalhos
const LINE_CAP = 150;
// Gatilho de paginação (linhas OU caracteres, o que vier primeiro). Não corta nada: indica que é hora de
// rotacionar ou criar o shard `-02.md`. Memória: orçamento de 10.000 − ~3.000 reservados para alertas,
// tasks e changes. Validation: não é injetado; o teto é higiene de leitura do padrão.
const CHAR_CAPS = { "11-project-memory.md": 7000, "10-validation.md": 16000 };
const MAX_TASKS = 15;
const MAX_CHANGES = 10;
const MAX_TITLE = 80;

// Aceita o formato canônico do template (`TASK-001` sozinho na linha + `Status: ...`)
// e a variante em Markdown (`### TASK-001` + `- **Status:** ...`).
const RE_TASK_HEADER = /^\s*(?:#{1,6}\s*)?(?:\*\*)?(TASK-[A-Za-z0-9_-]*\d)(?:\*\*)?\s*(?:[—–:-]\s*(.*))?$/;
const fieldRe = (name) => new RegExp(`^\\s*(?:[-*]\\s+)?(?:\\*\\*)?${name}(?::\\*\\*|\\*\\*:|:)[ \\t]*(.*)$`, "i");
const RE_STATUS = fieldRe("Status");
const RE_TITLE = fieldRe("Title");
const RE_ACTIVE = /^(Pending|In Progress|Blocked)\b/i;

// Texto antes da primeira task (legenda do ledger) e blocos "Registro do gate" (linhas `>`) são ignorados.
function parseActiveTasks(text) {
  const tasks = [];
  let current = null;
  let fenced = false;
  for (const line of text.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) { fenced = !fenced; continue; }
    if (fenced) continue;
    const header = line.match(RE_TASK_HEADER);
    if (header) {
      current = { id: header[1], title: (header[2] || "").trim(), status: null };
      tasks.push(current);
      continue;
    }
    if (!current || line.trimStart().startsWith(">")) continue;
    if (current.status === null) {
      const s = line.match(RE_STATUS);
      if (s) { current.status = s[1].trim().replace(/^\*+|\*+$/g, "").trim(); continue; }
    }
    if (!current.title) {
      const t = line.match(RE_TITLE);
      if (t) current.title = t[1].trim();
    }
  }
  return tasks.filter((t) => t.status && RE_ACTIVE.test(t.status));
}

const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
// Seções críticas da memória, em ordem de prioridade (títulos do template; aceita variações).
const CRITICAL_SECTIONS = [/^estado atual|^current state/, /^proximos passos|^next steps/, /^pendencias|^open items|^blockers/];

// Recorta da memória só as seções críticas (título + corpo até o próximo título de mesmo nível ou acima).
function criticalSections(md) {
  const lines = md.split(/\r?\n/);
  const picked = [];
  for (const re of CRITICAL_SECTIONS) {
    for (let i = 0; i < lines.length; i++) {
      const h = lines[i].match(/^(#{1,6})\s+(.*)$/);
      if (!h || !re.test(norm(h[2]))) continue;
      let j = i + 1;
      while (j < lines.length) {
        const n = lines[j].match(/^(#{1,6})\s+/);
        if (n && n[1].length <= h[1].length) break;
        j++;
      }
      picked.push(lines.slice(i, j).join("\n").trimEnd());
      break;
    }
  }
  return picked.join("\n\n");
}

// Corta em fronteira de linha para caber em `max` caracteres.
function fitLines(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, Math.max(0, max));
  const nl = cut.lastIndexOf("\n");
  return nl > 0 ? cut.slice(0, nl) : cut;
}

// Memória dentro do orçamento: inteira se couber; senão seções críticas + instrução explícita de leitura.
function memoryWithinBudget(memory, budget) {
  if (memory.length <= budget) return memory;
  const notice =
    `> **MEMÓRIA INCOMPLETA NESTA INJEÇÃO:** \`docs/sdd/11-project-memory.md\` tem ${memory.length} caracteres e ` +
    `não cabe no orçamento de injeção desta plataforma (${INJECTION_BUDGET}). Abaixo vão só as seções críticas. ` +
    `**Leia o arquivo inteiro com a ferramenta de leitura antes de agir** e aplique a higiene (rotação para ` +
    `\`archive/memory-history.md\` ou shard \`-02.md\`).\n\n`;
  const core = criticalSections(memory) || memory;
  return notice + fitLines(core, budget - notice.length);
}

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const sddDir = resolve(root, "docs/sdd");
const read = (p) => { try { return readFileSync(resolve(root, p), "utf8"); } catch { return null; } };

if (!existsSync(sddDir)) process.exit(0); // projeto sem SDD: silencioso

const memory = read("docs/sdd/11-project-memory.md");
const tasks = read("docs/sdd/07-tasks.md");

// ── Prioridade 1: alertas, shards, tasks e changes (tamanho limitado) ──
let fixed = "";

const overCap = Object.entries(CHAR_CAPS)
  .map(([name, charCap]) => {
    const text = read(`docs/sdd/${name}`) ?? "";
    return { name, lines: text ? text.split(/\r?\n/).length : 0, chars: text.length, charCap };
  })
  .filter((f) => f.lines > LINE_CAP || f.chars > f.charCap)
  .map((f) => `\`docs/sdd/${f.name}\` (${f.lines} linhas, ${f.chars} caracteres; teto ${LINE_CAP} linhas ou ${f.charCap} caracteres)`);
if (overCap.length > 0) {
  fixed += `\n> **ALERTA de Paginação Elástica:** ${overCap.join(", ")} ultrapassa(m) o teto. Antes de prosseguir, aplique a higiene: mova itens resolvidos/antigos para \`docs/sdd/archive/\` e, se o conteúdo ATIVO ainda não couber, crie o shard \`-02.md\` com índice no topo. Nunca resuma nem corte o conteúdo de uma dívida para caber.\n`;
}

try {
  const overflowFiles = readdirSync(sddDir).filter((name) => /-0[2-9]\.md$/i.test(name)).sort();
  if (overflowFiles.length > 0) {
    const listStr = overflowFiles.map((f) => `\`docs/sdd/${f}\``).join(", ");
    fixed += `\n> **Paginação Elástica Ativa:** Existem arquivos complementares de memória/dívida (${listStr}). Consulte-os sob demanda se a tarefa atual tocar nos escopos indicados no cabeçalho principal.\n`;
  }
} catch {}

if (tasks) {
  const active = parseActiveTasks(tasks);
  if (active.length > 0) {
    const shown = active.slice(0, MAX_TASKS).map((t) => `- ${t.id} [${t.status}] ${clip(t.title || "(sem título)", MAX_TITLE)}`);
    const more = active.length > MAX_TASKS ? `\n(+${active.length - MAX_TASKS} não exibidas)` : "";
    fixed += `\n### Tasks não concluídas (${active.length})\n${shown.join("\n")}${more}\n`;
  }
}

try {
  const changesDir = resolve(sddDir, "changes");
  const names = existsSync(changesDir)
    ? readdirSync(changesDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
    : [];
  if (names.length > 0) {
    const lines = names.slice(0, MAX_CHANGES).map((name) => {
      const active = parseActiveTasks(read(`docs/sdd/changes/${name}/tasks.md`) ?? "");
      const inProgress = active.filter((t) => /^In Progress\b/i.test(t.status)).length;
      const label = clip(name, MAX_TITLE);
      return active.length > 0
        ? `- \`changes/${label}/\` — ${active.length} task(s) não concluída(s), ${inProgress} In Progress`
        : `- \`changes/${label}/\` — sem tasks ativas (verifique se falta o archive)`;
    });
    const more = names.length > MAX_CHANGES ? `\n(+${names.length - MAX_CHANGES} changes não exibidas)` : "";
    fixed += `\n### Changes ativas (${names.length})\n${lines.join("\n")}${more}\n`;
  }
} catch {}

const header = "## Protocolo SDD — estado carregado automaticamente (plugin sdd-workflow)\n";
const footer = "\nSiga o protocolo: confirme estado e próximo passo em até 5 linhas e prossiga com o pedido do usuário no mesmo turno (a confirmação não substitui a ação).";

// ── Prioridade 2: memória no orçamento que sobrou ──
const memoryBudget = INJECTION_BUDGET - SAFETY_MARGIN - header.length - fixed.length - footer.length - 2;
const memoryBlock = memory
  ? `\n${memoryWithinBudget(memory.trim(), memoryBudget)}\n`
  : "\n(11-project-memory.md ainda não existe — rode /sdd-workflow:init ou :adopt)\n";

const out = header + memoryBlock + fixed + footer;
console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: out } }));

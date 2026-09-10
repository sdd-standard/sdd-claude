#!/usr/bin/env node
/**
 * check-ids.mjs — guarda mecânica de identificadores SDD (plugin sdd-workflow).
 *
 * Detecta:
 *   ÓRFÃS       IDs citados (docs ou código) que não têm declaração em lugar nenhum.
 *   NÃO CITADAS IDs declarados que ninguém referencia (furo de rastreabilidade).
 *
 * ZERO CONFIGURAÇÃO: não conhece nomes de feature. Reconhece a GRAMÁTICA
 *   PREFIXO[-ESCOPO][-Mn]-NÚMERO  →  VAL-001, VAL-PA-001, VAL-auth-M1-03, TSK-PA-014
 * O segmento de escopo é descoberto sozinho, seja qual for a feature.
 *
 * Declaração = o ID sozinho no início de uma linha, dentro de docs/sdd/
 *              (aceita #, -, *, > antes e " — título" depois).
 * Citação    = qualquer outra ocorrência, em qualquer arquivo do repositório.
 *
 * Escopo de varredura por EXCLUSÃO, nunca por inclusão: varre o repositório
 * inteiro menos a lista de ignorados. Pasta nova entra sozinha — foi o recorte
 * "apps/api/src" que deixou passar o resíduo em prisma/schema.prisma.
 *
 * Uso: node check-ids.mjs [raiz] [--json] [--strict] [--prefixes=ADR,REQ]
 *      --strict  falha também quando há declaração nunca citada
 * Saída: exit 1 se houver órfãs (ou não citadas, com --strict).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, extname, sep } from "node:path";

const args = process.argv.slice(2);
const root = args.find((a) => !a.startsWith("--")) ?? process.cwd();
const asJson = args.includes("--json");
const strict = args.includes("--strict");
const extra = (args.find((a) => a.startsWith("--prefixes="))?.split("=")[1] ?? "")
  .split(",").map((s) => s.trim()).filter(Boolean);

const PREFIXES = [...new Set(["VAL", "FR", "NFR", "DES", "TASK", "TSK", "AC", "IB", ...extra])];

const IGNORE_DIRS = new Set([".git", "node_modules", "dist", "build", "out", ".next", ".turbo",
  "coverage", ".venv", "venv", "__pycache__", "bin", "obj", ".cache", ".pnpm-store"]);
const IGNORE_FILE = /^pnpm-lock|^package-lock|^yarn\.lock|\.min\.(js|css)$/i;
const BINARY_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".pdf", ".zip",
  ".gz", ".tgz", ".woff", ".woff2", ".ttf", ".eot", ".mp4", ".mp3", ".xlsx", ".docx", ".pptx"]);

const idCore = `(?:${PREFIXES.join("|")})(?:[-_][A-Za-z][A-Za-z0-9]{0,15})*[-_]\\d{1,4}`;
const RE_ANY = new RegExp(idCore, "g");
const RE_DECL = new RegExp(`^[#>\\-*\\s]*(${idCore})\\s*(?:[—–:-]\\s*\\S.*)?$`);
const RE_RANGE = new RegExp(`(${idCore})\\s*\\.\\.\\s*(?:(?:${PREFIXES.join("|")})[-_])?(\\d{1,4})`, "g");
const RE_PLACEHOLDER = /[<{]|\b(nnn|xxx|nn|kk)\b/i;
const RE_GATE_LOCAL = /[-_]M\d+[-_]\d{1,4}$/; // VAL-<feat>-M1-03: local ao registro do gate

const files = [];
(function walk(dir) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) { if (!IGNORE_DIRS.has(e.name)) walk(full); continue; }
    if (!e.isFile()) continue;
    if (IGNORE_FILE.test(e.name) || BINARY_EXT.has(extname(e.name).toLowerCase())) continue;
    try { if (statSync(full).size > 2_000_000) continue; } catch { continue; }
    files.push(full);
  }
})(root);

const declared = new Map(); // id -> "arquivo:linha"
const cited = new Map();    // id -> ["arquivo:linha", ...]
const isSddDoc = (rel) => rel.includes("docs/sdd/");

for (const file of files) {
  let text;
  try { text = readFileSync(file, "utf8"); } catch { continue; }
  if (text.includes("\u0000")) continue; // binário disfarçado
  const rel = relative(root, file).split(sep).join("/");
  const isMd = extname(file).toLowerCase() === ".md";
  const declSource = isSddDoc(rel);
  let fenced = false;

  text.split(/\r?\n/).forEach((line, i) => {
    if (isMd && /^\s*```/.test(line)) { fenced = !fenced; return; }
    const where = `${rel}:${i + 1}`;

    if (declSource && !fenced) {
      const m = line.match(RE_DECL);
      if (m && !RE_PLACEHOLDER.test(line)) {
        if (!declared.has(m[1])) declared.set(m[1], where);
        return; // linha de declaração não conta como citação
      }
    }
    if (isMd && fenced) return;            // exemplo em bloco de código
    if (RE_PLACEHOLDER.test(line)) return; // placeholder de template

    for (const r of line.matchAll(RE_RANGE)) { // VAL-101..107 cita os sete
      const first = r[1];
      const digits = first.match(/\d{1,4}$/)[0];
      const head = first.slice(0, first.length - digits.length);
      const start = parseInt(digits, 10);
      const end = parseInt(r[2], 10);
      if (end > start && end - start < 200) {
        for (let n = start; n <= end; n++) {
          const id = head + String(n).padStart(digits.length, "0");
          if (!cited.has(id)) cited.set(id, []);
          cited.get(id).push(where);
        }
      }
    }
    for (const m of line.matchAll(RE_ANY)) {
      // ID local de gate (VAL-<feat>-Mn-nn) nasce inline no bloco "Registro do gate"
      // dentro do ledger: a citação em docs/sdd/ É a declaração dele.
      if (declSource && RE_GATE_LOCAL.test(m[0]) && !declared.has(m[0])) declared.set(m[0], where);
      if (!cited.has(m[0])) cited.set(m[0], []);
      cited.get(m[0]).push(where);
    }
  });
}

const orphans = [...cited.entries()].filter(([id]) => !declared.has(id))
  .map(([id, refs]) => ({ id, refs: [...new Set(refs)] }))
  .sort((a, b) => a.id.localeCompare(b.id));
const uncited = [...declared.entries()].filter(([id]) => !cited.has(id))
  .map(([id, at]) => ({ id, at })).sort((a, b) => a.id.localeCompare(b.id));

if (asJson) {
  console.log(JSON.stringify({ scanned: files.length, declared: declared.size, citedIds: cited.size, orphans, uncited }, null, 2));
} else {
  console.log(`check-ids: ${files.length} arquivos varridos | ${declared.size} IDs declarados | ${cited.size} citados`);
  if (orphans.length) {
    console.log(`\nX SIGLAS ORFAS (${orphans.length}) - citadas mas nunca declaradas:`);
    for (const o of orphans) {
      const head = o.refs.slice(0, 6).join("\n      ");
      const more = o.refs.length > 6 ? `\n      ...(+${o.refs.length - 6})` : "";
      console.log(`  ${o.id}\n      ${head}${more}`);
    }
  } else {
    console.log("\nOK nenhuma sigla orfa.");
  }
  if (uncited.length) {
    console.log(`\n${strict ? "X" : "!"} DECLARADAS E NUNCA CITADAS (${uncited.length}) - possivel furo de rastreabilidade:`);
    for (const u of uncited) console.log(`  ${u.id}  (declarada em ${u.at})`);
  }
}
process.exit(orphans.length || (strict && uncited.length) ? 1 : 0);

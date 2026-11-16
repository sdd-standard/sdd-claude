/**
 * say-do-lib.mjs — núcleo do Say-Do Gate (Camada 0 do Quality Gate, 100% passivo).
 *
 * Mantém um ledger append-only FORA do repositório (pasta temporária do SO, um arquivo por projeto)
 * com os eventos de ferramenta registrados pelo hook pós-ferramenta: edições de arquivo e comandos
 * de terminal com seu exit code. O auditor (`say-do-audit.mjs`) apenas lê esse ledger.
 *
 * Princípio de segurança (fail-closed): ausência de evidência NUNCA é aprovação.
 *   - Exit code indeterminado                        → o comando não conta como prova.
 *   - Ledger vazio (hook não disparou, máquina nova) → NO_EVIDENCE, não "passed".
 *   - Teste mascarado (`|| true`, pipe sem pipefail, --help, --collect-only) → não conta.
 *
 * Este arquivo é idêntico nos plugins sdd-claude e sdd-antigravity.
 */
import { createHash } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

const MAX_LEDGER_BYTES = 256 * 1024;
const KEEP_LINES_ON_TRIM = 300;

const WRAPPER_RE = new RegExp(
  "^(?:(?:sudo|time|command|exec|npx|bunx|pnpx)\\s+(?:-\\S+\\s+)*" +
  "|(?:pnpm|yarn|bun)\\s+(?:exec|dlx)\\s+" +
  "|(?:uv|poetry|pipenv|hatch|pdm|bundle)\\s+(?:run|exec)\\s+" +
  "|python[\\d.]*\\s+-m\\s+" +
  "|\\./)", "i");
const ENV_ASSIGN_RE = /^(?:[A-Za-z_][A-Za-z0-9_]*=\S*\s+)+/;

// O runner precisa ser a CABEÇA do segmento de comando (não basta aparecer no texto).
const TEST_HEAD_RE = new RegExp(
  "^(?:pytest|unittest|tox|nox|vitest|jest|mocha|ava|tsc|phpunit|rspec|ctest" +
  "|(?:npm|pnpm|yarn|bun)\\s+(?:run\\s+)?(?:test|build|typecheck|check)(?:[:\\w-]*)" +
  "|cargo\\s+(?:test|build|check)" +
  "|go\\s+(?:test|build|vet)" +
  "|dotnet\\s+(?:test|build)" +
  "|deno\\s+test" +
  "|mvnw?\\s+(?:\\S+\\s+)*(?:test|verify|package|install)" +
  "|gradlew?\\s+(?:\\S+\\s+)*(?:test|build|check)" +
  "|make\\s+(?:test|check|build)" +
  "|(?:rake|mix)\\s+test)\\b", "i");
const DRY_RUN_RE = /(?:^|\s)(?:--help|-h|--version|--collect-only|--co|--listTests|--list|--dry-run|--no-run)(?:\s|$)/i;

// Edição de arquivo feita pelo terminal (heurística conservadora: na dúvida, exige re-rodar os testes)
const TERMINAL_MUTATION_RE = new RegExp(
  "\\bsed\\s+(?:-\\S+\\s+)*-i|\\bperl\\s+-\\S*i|\\btee\\s+(?!/dev/null)" +
  "|\\bgit\\s+(?:apply|checkout|restore|merge|rebase|cherry-pick|revert|stash\\s+(?:pop|apply)|reset\\s+--hard)\\b" +
  "|\\bpatch\\s+-p|(?<![0-9&>])>{1,2}\\s*(?!/dev/null|&)[^\\s>&|]", "i");

/** Sobe a árvore a partir de `start` até achar uma pasta com `docs/sdd/`. Retorna null se não houver. */
export function findProjectRoot(start) {
  let dir = resolve(start || process.cwd());
  for (;;) {
    if (existsSync(join(dir, "docs", "sdd"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

export function ledgerPath(root) {
  let key = resolve(root).replace(/\\/g, "/").replace(/\/+$/, "");
  if (process.platform === "win32") key = key.toLowerCase();
  const hash = createHash("sha1").update(key).digest("hex").slice(0, 16);
  return join(tmpdir(), "sdd-say-do", `${hash}.jsonl`);
}

function splitSegments(cmd) {
  const parts = cmd.split(/(\|\||&&|;|\||\n)/);
  const segments = [];
  for (let i = 0; i < parts.length; i += 2) {
    const text = parts[i].trim();
    if (text) segments.push({ text, opAfter: parts[i + 1] ?? "" });
  }
  return segments;
}

function stripWrappers(segment) {
  let text = segment.trim().replace(/^\(+/, "").trim().replace(ENV_ASSIGN_RE, "");
  for (let i = 0; i < 4; i++) {
    const next = text.replace(WRAPPER_RE, "").trim();
    if (next === text) break;
    text = next;
  }
  return text;
}

/**
 * isTestOrBuild: algum segmento tem um runner de teste/build como cabeça.
 * masked:        o exit code do comando composto não prova o resultado do teste.
 * mutatesFiles:  o comando provavelmente editou arquivos (conta como edição de código).
 */
export function classifyCommand(cmd) {
  const hasPipefail = cmd.includes("pipefail");
  let isTestOrBuild = false;
  let masked = false;
  for (const seg of splitSegments(cmd)) {
    const head = stripWrappers(seg.text);
    if (!TEST_HEAD_RE.test(head)) continue;
    isTestOrBuild = true;
    if (seg.opAfter === "||" || DRY_RUN_RE.test(head)) masked = true;
    if (seg.opAfter === "|" && !hasPipefail) masked = true;
  }
  return { isTestOrBuild, masked, mutatesFiles: !isTestOrBuild && TERMINAL_MUTATION_RE.test(cmd) };
}

export function terminalEvent(command, exitCode) {
  const info = classifyCommand(command);
  return info.mutatesFiles
    ? { kind: "code_write", path: "(via terminal)", command, exitCode }
    : { kind: "terminal", command, exitCode, isTestOrBuild: info.isTestOrBuild, masked: info.masked };
}

export function writeEvent(filePath) {
  const isSddDoc = String(filePath ?? "").replace(/\\/g, "/").includes("docs/sdd/");
  return { kind: isSddDoc ? "doc_write" : "code_write", path: String(filePath ?? "") };
}

export function appendEvent(root, event) {
  const file = ledgerPath(root);
  mkdirSync(dirname(file), { recursive: true });
  appendFileSync(file, JSON.stringify({ ts: Date.now(), ...event }) + "\n", "utf8");
  try {
    if (statSync(file).size > MAX_LEDGER_BYTES) {
      const lines = readFileSync(file, "utf8").split("\n").filter(Boolean);
      writeFileSync(file, lines.slice(-KEEP_LINES_ON_TRIM).join("\n") + "\n", "utf8");
    }
  } catch { /* ledger é best-effort: nunca derruba a ferramenta */ }
}

export function readEvents(root) {
  let text;
  try { text = readFileSync(ledgerPath(root), "utf8"); } catch { return []; }
  const events = [];
  for (const line of text.split("\n")) {
    if (!line.trim()) continue;
    try { events.push(JSON.parse(line)); } catch { /* linha corrompida: ignora */ }
  }
  return events.map((e, i) => ({ ...e, seq: i + 1 }));
}

export function auditEvents(events) {
  const codeWrites = events.filter((e) => e.kind === "code_write");
  const lastWriteSeq = codeWrites.length ? codeWrites[codeWrites.length - 1].seq : 0;
  const runsAfter = events.filter((e) => e.kind === "terminal" && e.isTestOrBuild && e.seq > lastWriteSeq);

  // Vale a ÚLTIMA execução de cada comando distinto (falhou e depois passou = passou).
  const latest = new Map();
  for (const run of runsAfter) latest.set(run.command.split(/\s+/).join(" "), run);
  const runs = [...latest.values()];
  const proven = runs.filter((r) => r.exitCode === 0 && !r.masked);
  const failed = runs.filter((r) => r.exitCode !== 0 && r.exitCode !== null && r.exitCode !== undefined);
  const unproven = runs.filter((r) => !proven.includes(r) && !failed.includes(r));

  let status, passed, message;
  if (failed.length) {
    const bad = failed[failed.length - 1];
    status = "FAILED_AFTER_EDIT"; passed = false;
    message = `Say-Do Gate (Passivo): ALERTA — \`${bad.command}\` falhou (exit code ${bad.exitCode}) após a última edição de código. O implementador deve corrigir e re-executar.`;
  } else if (proven.length) {
    status = "VERIFIED_PASS"; passed = true;
    message = `Say-Do Gate (Passivo): OK — \`${proven[proven.length - 1].command}\` executado com exit code 0 após a última edição de código registrada.`;
  } else if (codeWrites.length) {
    status = "UNVERIFIED_CODE_EDIT"; passed = false;
    const detail = unproven.length
      ? " Houve execução de teste/build, mas ela não serve de prova (exit code indeterminado ou comando mascarado por `||`, pipe ou flag de dry-run)."
      : "";
    message = `Say-Do Gate (Passivo): ALERTA — ${codeWrites.length} edição(ões) de código sem execução comprovada de teste/build com exit code 0 depois.${detail} O implementador deve rodar o comando oficial de testes (constitution §3) e re-auditar.`;
  } else {
    status = "NO_EVIDENCE"; passed = null;
    message = "Say-Do Gate (Passivo): SEM EVIDÊNCIA — o ledger não registra edição de código nem execução comprovada de testes (hook pós-ferramenta inativo, máquina/ambiente diferente ou ledger expirado). Ausência de evidência NÃO é aprovação: se o escopo auditado alterou código, rode agora o comando oficial de testes (constitution §3) e re-audite.";
  }

  return {
    passed, status, message,
    codeEditsCount: codeWrites.length,
    testRunsAfterLastEdit: runsAfter.length,
    recentTestCommands: runsAfter.slice(-5).map((r) => ({ command: r.command, exitCode: r.exitCode ?? null, masked: !!r.masked })),
  };
}

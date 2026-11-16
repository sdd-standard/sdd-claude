#!/usr/bin/env node
/**
 * say-do-audit.mjs — Say-Do Gate (Camada 0 do Quality Gate, 100% passivo / read-only).
 *
 * Lê o ledger gravado pelo hook pós-ferramenta e responde: houve execução real de teste/build
 * com exit code 0 DEPOIS da última edição de código? Não roda testes nem altera arquivos.
 *
 * Uso:  node say-do-audit.mjs [raiz-do-projeto] [--json]
 * Saída (exit code):
 *   0  VERIFIED_PASS         prova mecânica presente
 *   1  FAILED_AFTER_EDIT     teste/build falhou após a última edição
 *   1  UNVERIFIED_CODE_EDIT  código editado sem teste/build comprovado depois
 *   2  NO_EVIDENCE           ledger vazio — NÃO é aprovação: rode os testes e re-audite
 */
import { auditEvents, findProjectRoot, ledgerPath, readEvents } from "./say-do-lib.mjs";

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const start = args.find((a) => !a.startsWith("--")) ?? process.cwd();
const root = findProjectRoot(start) ?? start;

const report = { ...auditEvents(readEvents(root)), projectRoot: root, ledger: ledgerPath(root) };

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`say-do-audit: ${report.status}`);
  console.log(report.message);
  console.log(`edições de código no ledger: ${report.codeEditsCount} | execuções de teste/build após a última edição: ${report.testRunsAfterLastEdit}`);
  for (const r of report.recentTestCommands) {
    console.log(`  - exit=${r.exitCode ?? "?"}${r.masked ? " (mascarado)" : ""}  ${r.command}`);
  }
}
process.exit(report.status === "VERIFIED_PASS" ? 0 : report.status === "NO_EVIDENCE" ? 2 : 1);

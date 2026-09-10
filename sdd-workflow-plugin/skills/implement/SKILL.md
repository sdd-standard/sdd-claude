---
name: implement
description: Executa uma task do ledger SDD com gates de qualidade e Plan Mode. Use quando o usuário pedir para implementar, codificar ou continuar o desenvolvimento.
---

# SDD — Implement

1. Protocolo de sessão: constitution.md → 11-project-memory.md → 10-validation.md → ledger (07-tasks.md e/ou changes/*/tasks.md).
2. Selecione a task: a In Progress existente, ou a primeira Pending sem dependências bloqueadas. Confirme com o usuário em 1 linha.
3. Gate de entrada: task tem Related Requirements e Done When? Achados Critical/High abertos? Se sim → pare e reporte.
4. Git: feature → branch (conforme constitution). Delegue ao subagent **sdd-implementer** (que usará Plan Mode em tasks não triviais).
5. Gate de saída: testes verdes + Done When satisfeito + Status Done + 11-project-memory.md atualizado.
6. Se a task concluir funcionalidade visível: acione **sdd-doc-writer** (README + docs de feature) antes do PR.
7. **Gate de milestone** — ao concluir a última task de um milestone:
   a. **Guarda mecânica primeiro** (você tem Bash; o validador não): rode na raiz do projeto
      `node "${CLAUDE_PLUGIN_ROOT}/scripts/check-ids.mjs" .`
      Ele varre o repositório INTEIRO (exclusão, nunca inclusão) e aponta siglas órfãs (IDs citados sem declaração) e declarações nunca citadas. Exit 1 = há órfãs → corrija ANTES do gate. Entregue a saída ao validador como evidência; ela não substitui a auditoria, é o piso mecânico dela.
   b. Acione **sdd-validator** para auditar o milestone inteiro contra os FR/NFR/AC dele (leitura de código real, não relatórios).
   c. Achado Critical/High → tente resolver no mesmo gate SE a correção for apenas tornar o código conforme a spec já aprovada (corrija e re-rode a suíte completa). Se a correção exigir *mudar a spec* ou uma decisão de produto, você NÃO resolve sozinho: o achado só pode passar como APROVADO COM RESSALVA mediante aceite EXPLÍCITO do usuário (sempre confirme antes) e é registrado como dívida ativa no 10-validation.md global. Sem aceite → BLOQUEADO; o milestone não avança.
   d. Registre um bloco **"Registro do gate Mn"** no ledger, logo abaixo da linha do gate: veredito + cada achado com seu desfecho (trilha completa de auditoria). Regra de destino: achado CORRIGIDO no gate morre nesse bloco; **todo achado que fica ABERTO — qualquer severidade (lacuna aceita, agendada para Mx ou dívida de projeto) — também é registrado no 10-validation.md global** como dívida ativa (ID global, 1–2 parágrafos de contexto para o próximo agente, ponteiro cruzado ledger↔global). Nada aberto vive só no ledger: o 10-validation global é o backlog de /change.
   e. Higiene: se uma dívida do 10-validation.md for RESOLVIDA (neste gate ou depois), MOVA a entrada para `docs/sdd/archive/validation-log.md` (append-only) com data e o que a fechou — o 10-validation guarda só dívida ativa, para não inchar (é lido no protocolo de sessão).
   f. Apresente o resultado ao usuário: o milestone seguinte só inicia após aprovação manual dele. Nesse momento, ofereça o commit do milestone (nunca commite sem pedido explícito).

Se surgir necessidade de mudar a spec durante a implementação → PARE e use /sdd-workflow:change. Código nunca diverge da spec silenciosamente. Exceção controlada: divergência que apenas RESTRINGE o design ou documenta uma decisão local (sem mudar comportamento/escopo prometido) pode ser resolvida com **nota de emenda datada** no ponto exato do artefato, aprovada no turno — nunca edição silenciosa. Toda emenda datada carrega o ponteiro `→ reconciliar no próximo /change ou archive desta área`, para a restrição não se acumular esquecida na spec consolidada.

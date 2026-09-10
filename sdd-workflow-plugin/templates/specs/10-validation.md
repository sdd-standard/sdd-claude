# 10 — Validation

Gate: nenhum milestone avança com achados Critical/High abertos — salvo dívida Critical/High explicitamente aceita pelo usuário (sempre confirmada antes) e registrada aqui como ativa (ver skill implement, passo 7).

> Convenção de duas camadas para achados de gate de milestone (por ESTADO, não por alcance):
> - Achado **CORRIGIDO no gate** vive apenas no bloco "Registro do gate Mn" do ledger (07-tasks) — trilha de auditoria.
> - **Todo achado que fica ABERTO** — qualquer severidade, seja lacuna aceita, fechamento agendado ou dívida de projeto — é registrado AQUI como dívida ativa, com ID sequencial global, contexto para o próximo agente (1–2 parágrafos: o quê, onde, por que importa, molde de correção) e ponteiro para o registro de origem no ledger.
>
> Regra dura: nada aberto vive só no ledger. Este arquivo é o backlog vivo de dívida do projeto e o ponto de partida de novos /change.
>
> **Higiene de contexto:** este arquivo é lido no protocolo de sessão e pela skill implement, então contém APENAS dívida ATIVA — mantenha-o enxuto. Ao resolver uma dívida, NÃO marque "Resolvido" aqui: MOVA a entrada para `docs/sdd/archive/validation-log.md` (append-only, cold storage), preservando o ID global (nunca reutilizado). A rastreabilidade ledger↔global↔log continua por busca de ID.

VAL-001
Severity: Critical | High | Medium | Low
Issue:
Impact:
Recommendation:
Status: PENDENTE DE DEFINIÇÃO

## Dívidas ativas do projeto (backlog para /change)

<!-- Registre AQUI todo achado que ficou aberto em qualquer gate — de milestone ou não. Formato igual ao VAL-nnn acima + linha "Origem: gate Mn de <feature> (VAL-<feat>-Mn-nn)" quando vier de um gate. Este é o ponto de partida natural para abrir novos /sdd-workflow:change. Ao resolver, MOVA a entrada para docs/sdd/archive/validation-log.md (não deixe cópia aqui) — este arquivo fica pequeno de propósito. -->

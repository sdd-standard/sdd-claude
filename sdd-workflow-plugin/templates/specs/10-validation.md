# 10 — Validation

Gate: nenhum milestone avança com achados Critical/High abertos — salvo dívida Critical/High explicitamente aceita pelo usuário (sempre confirmada antes) e registrada aqui como ativa (ver skill implement, passo 7).

> **Convenção de duas camadas para achados de gate de milestone (por ESTADO, não por alcance):**
> - Achado **CORRIGIDO no gate** vive apenas no bloco `"Registro do gate Mn"` do ledger (`07-tasks.md`) — trilha de auditoria.
> - **Todo achado que fica ABERTO** — qualquer severidade, seja lacuna aceita, fechamento agendado ou dívida de projeto — é registrado AQUI como dívida ativa, com ID sequencial global (`VAL-nnn`), contexto para o próximo agente (1–2 parágrafos curtos de até 4–5 linhas cada: o quê, onde, por que importa, molde de correção) e ponteiro para o registro de origem no ledger.
>
> **Higiene de Contexto & Paginação Elástica (*Overflow Sharding*):**
> 1. Este arquivo contém **APENAS dívida ATIVA**. Ao resolver uma dívida, NÃO marque "Resolvido" aqui: **MOVA** a entrada para `docs/sdd/archive/validation-log.md` (append-only, cold storage), preservando o ID global (nunca reutilizado).
> 2. **Teto e Densidade:** Máximo de **150 linhas por arquivo** e **máximo de 4 a 5 linhas por parágrafo** (é proibido criar parágrafos gigantescos de uma única linha).
> 3. **Transbordo Estruturado (`10-validation-02.md`):** Se o projeto acumular muitas dívidas/pendências ATIVAS legítimas que ultrapassem 150 linhas, **não esprema nem omita informações**: crie `docs/sdd/10-validation-02.md` (e `-03.md` se necessário) nos mesmos moldes e ative o bloco de índice de paginação abaixo.
> 4. **Auto-Compactação e Exclusão:** Conforme as dívidas forem sanadas e movidas para `archive/validation-log.md`, quando as entradas remanescentes de `10-validation-02.md` couberem novamente neste arquivo principal (`≤ 150 linhas`), mova-as de volta para cá, remova o link de paginação e **EXCLUA imediatamente o arquivo `10-validation-02.md`**.

<!-- Descomente o bloco abaixo apenas quando existir arquivo paginado ativo (-02.md):
> 📄 **Paginação Ativa de Dívidas (Overflow):**
> - [10-validation-02.md](./10-validation-02.md) — `VAL-xxx` a `VAL-yyy` (Escopo: <módulos/temas>)
-->

> **Matriz Canônica de Severidades (`Critical | High | Medium | Low` + Calibração via `constitution.md`):**
> - **`Critical` (BLOQUEIA):** Violação da `constitution.md`, falha de segurança/dados, falha no Piso Mecânico (`check-ids` ou testes quebrados/não rodados após edição), regressão ou cláusula principal `shall` não atendida.
> - **`High` (BLOQUEIA):** Omissão de condição GEARS (`Where`/`While`/`When`), falha na Infra Global (middlewares, auth, rotas raiz, banco), requisito sem teste cobrindo seu `AC-xxx` ou *scope creep* fora da spec.
> - **`Medium` (NÃO BLOQUEIA):** Desvio parcial de `DES-xxx` sem afetar comportamento (`FR`/`AC`), borda secundária sem teste, verificação manual de runtime ou dívida contida no módulo.
> - **`Low` (NÃO BLOQUEIA):** Cosmético, nomenclatura interna menor ou otimização opcional.

VAL-001
Severity: Critical | High | Medium | Low
Issue:
Impact:
Recommendation:
Status: PENDENTE DE DEFINIÇÃO

## Dívidas ativas do projeto (backlog para /sdd-workflow:change)

<!-- Registre AQUI todo achado que ficou aberto em qualquer gate — de milestone ou não. Formato igual ao VAL-nnn acima + linha "Origem: gate Mn de <feature> (VAL-<feat>-Mn-nn)" quando vier de um gate. Este é o ponto de partida natural para abrir novos /sdd-workflow:change. Ao resolver, MOVA a entrada para docs/sdd/archive/validation-log.md (não deixe cópia aqui) — este arquivo fica pequeno de propósito. -->

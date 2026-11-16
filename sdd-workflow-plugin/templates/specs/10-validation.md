# 10 — Validation

Gate: nenhum milestone avança com achado `Critical`/`High` aberto, salvo dívida com **Aceite de Risco do usuário** registrado na própria `VAL` (ver "Aceite de risco" abaixo).

> **Convenção de duas camadas para achados de gate de milestone (por ESTADO, não por alcance):**
> - Achado **CORRIGIDO no gate** vive apenas no bloco `"Registro do gate Mn"` do ledger (`07-tasks.md`) — trilha de auditoria.
> - **Todo achado que fica ABERTO** — qualquer severidade, seja lacuna aceita, fechamento agendado ou dívida de projeto — é registrado AQUI como dívida ativa, com ID sequencial global (`VAL-nnn`), os campos obrigatórios abaixo e ponteiro para o registro de origem no ledger.
>
> **Conteúdo obrigatório de cada dívida (o que nunca pode ser comprimido):** o quê (`Issue`), evidência `arquivo:linha` ou artefato e ID (`Evidence`), impacto (`Impact`), recomendação ou escopo mínimo (`Recommendation`), critério verificável de fechamento (`Closure Criteria`) e o histórico datado das decisões do usuário (`History`). Não há limite de tamanho por dívida: escreva o necessário para o próximo agente sanar a dívida sem reabrir a investigação. Parágrafos curtos ajudam a leitura, mas nunca resuma para caber.
> - **Fragmentação:** quando uma dívida tem frentes que fecham em changes diferentes, divida em `VAL` filhas com `Parent: VAL-xxx`; a mãe lista as filhas em `Links`.
> - **`Status` curto e pesquisável** (`Open`, `Scheduled: <Mx ou change>`, `Accepted`, `PENDENTE DE DEFINIÇÃO`); a narrativa de decisões fica em `History`.
>
> **Higiene de Contexto & Paginação Elástica (*Overflow Sharding*):**
> 1. Este arquivo contém **APENAS dívida ATIVA**. Ao resolver uma dívida, NÃO marque "Resolvido" aqui: **MOVA** a entrada para `docs/sdd/archive/validation-log.md` (append-only, cold storage), preservando o ID global (nunca reutilizado).
> 2. **Gatilho de paginação:** **150 linhas** OU **16.000 caracteres** neste arquivo, o que vier primeiro. O gatilho não autoriza cortar conteúdo: ele indica que é hora de criar o shard.
> 3. **Transbordo Estruturado (`10-validation-02.md`):** com o gatilho atingido por dívidas ATIVAS legítimas, crie `docs/sdd/10-validation-02.md` (e `-03.md` se necessário) nos mesmos moldes e ative o bloco de índice de paginação abaixo.
> 4. **Auto-Compactação e Exclusão:** quando as entradas remanescentes de `10-validation-02.md` couberem novamente neste arquivo (dentro dos dois tetos), mova-as de volta, remova o link de paginação e **EXCLUA imediatamente o arquivo `10-validation-02.md`**.

<!-- Descomente o bloco abaixo apenas quando existir arquivo paginado ativo (-02.md):
> 📄 **Paginação Ativa de Dívidas (Overflow):**
> - [10-validation-02.md](./10-validation-02.md) — `VAL-xxx` a `VAL-yyy` (Escopo: <módulos/temas>)
-->

> **Matriz Canônica de Severidades (`Critical | High | Medium | Low` + Calibração via seção 6 da `constitution.md`):**
> - **`Critical` (BLOQUEIA):** Violação da `constitution.md`, falha de segurança/dados, falha no Piso Mecânico (`check-ids` ou testes quebrados/não rodados após edição), regressão ou cláusula principal `shall` não atendida.
> - **`High` (BLOQUEIA):** Omissão de condição GEARS (`Where`/`While`/`When`), falha na Infra Global (middlewares, auth, rotas raiz, banco), requisito sem teste cobrindo seu `AC-xxx` ou *scope creep* fora da spec.
> - **`Medium` (NÃO BLOQUEIA):** Desvio parcial de `DES-xxx` sem afetar comportamento (`FR`/`AC`), borda secundária sem teste, verificação manual de runtime ou dívida contida no módulo.
> - **`Low` (NÃO BLOQUEIA):** Cosmético, nomenclatura interna menor ou otimização opcional.
>
> **Aceite de risco (só para `Critical`/`High`):** só o usuário aceita, nunca o agente. A severidade original é mantida; o aceite apenas libera o gate e o `implement`. A dívida recebe `Risk Acceptance` (quem, data, justificativa, gatilho de revisão) e `Status: Accepted`. Falha da Camada 0 (`check-ids`, Say-Do) **não é aceitável**. Aceitar violação da `constitution.md` exige registrar a exceção na seção 8 dela.
>
> **Dívida de maturidade:** quando um fluxo consome um artefato em `Reviewed` (ainda não `Approved`), registre uma dívida `Type: Maturity` por artefato-base, com o snapshot dos IDs e do texto consumidos. Ao aprovar a base: snapshot igual → mova ao archive como "fechada sem alteração"; diferente → revalide os dependentes listados e só então feche. Base alterada com dependentes não revalidados é `High` (deriva de spec).

VAL-001
Severity: Critical | High | Medium | Low
Type: Defect | Gap | Debt | Maturity
Issue: <o quê: comportamento ou lacuna observável>
Evidence: <arquivo:linha, ou artefato e ID>
Impact: <por que importa: fluxo, usuário ou regra afetados>
Recommendation: <escopo mínimo da correção / molde>
Closure Criteria: <condição verificável para mover ao archive>
Links: <VAL-xxx, FR-xxx, TASK-xxx, changes/...> (opcional)
Parent: <VAL-xxx> (só em dívida fragmentada)
Risk Acceptance: <quem>, <AAAA-MM-DD> — <justificativa> — revisão: <data ou gatilho> (só Critical/High aceito)
Status: PENDENTE DE DEFINIÇÃO
History:
- <AAAA-MM-DD> — <evento ou decisão do usuário>

<!-- Molde de dívida de maturidade (uma por artefato-base consumido em Reviewed):
VAL-xxx
Severity: Medium
Type: Maturity
Issue: <artefato-base> consumido em Reviewed (ainda não Approved).
Evidence: docs/sdd/<artefato-base> — Reviewed em <AAAA-MM-DD> (ref. git: <hash>, se houver)
Impact: se a base mudar antes da aprovação, os dependentes abaixo podem divergir dela.
Consumed By: <artefatos/changes dependentes e os IDs derivados>
Snapshot:
- <ID>: "<texto exato da cláusula consumida>"
Closure Criteria: na aprovação da base, snapshot igual → fechar sem alteração; diferente → revalidar os dependentes e então fechar.
Status: Open
History:
- <AAAA-MM-DD> — aberta ao derivar <dependente> de <artefato-base> em Reviewed.
-->

## Dívidas ativas do projeto (backlog para /sdd-workflow:change)

<!-- Registre AQUI todo achado que ficou aberto em qualquer gate — de milestone ou não. Formato igual ao VAL-nnn acima + linha "Origem: gate Mn de <feature> (VAL-<feat>-Mn-nn)" quando vier de um gate. Este é o ponto de partida natural para abrir novos /sdd-workflow:change. Ao resolver, MOVA a entrada para docs/sdd/archive/validation-log.md (não deixe cópia aqui) — este arquivo fica pequeno de propósito. -->

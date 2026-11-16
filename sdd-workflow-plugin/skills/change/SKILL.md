---
name: change
description: Ciclo de mudança SDD pós-baseline com delta specs (proposal → apply → archive) com Inspeção Escopada, Entrevista de Baixa Fricção, Fatiamento de Escopo, Validate-Gap e Paginação Elástica.
---

# SDD — Change (Delta Specs — Ciclo Completo v2.1)

Nunca edite os artefatos de baseline em `docs/sdd/` (`00`–`06`, `08` e `09`) diretamente após o baseline. Toda alteração — por menor que seja, inclusive correção urgente — passa por este fluxo; não existe atalho de "hotfix". (Os artefatos voláteis `07`, `10` e `11` continuam sendo atualizados a cada evento.)

Fluxo de 3 estados (`proposal` → `apply` → `archive`):

## Estado 1 — Proposal (Com Inspeção Escopada e Fatiamento Proativo)
1. **Inspeção Estritamente Escopada (*Scoped Inspection*)**:
   - Ao ouvir o objetivo da mudança do usuário, **NUNCA leia ou escaneie o código legado inteiro do repositório**.
   - Localize e leia **apenas os arquivos/módulos do domínio que será modificado ou discutido**, além de `constitution.md`, `11-project-memory.md` e `10-validation.md` (verificando se já existem dívidas ativas daquele domínio).
2. **Detecção de Change Grande Demais (*Scope Slicing*)**:
   - Se detectar que a mudança pedida pelo usuário é muito extensa (ex.: altera múltiplos *bounded contexts*, mistura grande refatoração com nova feature ou geraria dezenas de tasks), **pare antes de criar arquivos e proponha ao usuário**:
     - **Opção A (Fragmentar):** Dividir em múltiplas changes menores e sequenciais (`changes/<parte-1>/`, `changes/<parte-2>/`); ou
     - **Opção B (Estreitar + Registrar Dívida/Futuro):** Focar a change atual apenas no núcleo imediato e registrar as demais modificações solicitadas como **dívidas ativas / escopo futuro** em `docs/sdd/10-validation.md` (ou `06-roadmap.md`).
3. **Entrevista de Estresse de Baixa Fricção (Anti-Burocracia)**:
   - Com base no que você viu no código do domínio tocado, faça no máximo **3 a 5 perguntas cirúrgicas** sobre aspectos que o usuário não previu (contratos quebrados, migração de dados, falhas, segurança), **sempre sugerindo uma opção recomendada**.
4. **Geração e Aprovação**:
   - Crie `docs/sdd/changes/<kebab-name>/proposal.md` (`Intent Block`, `Why`, `What`, `Scope (in/out)`, `Success Criteria`, `Artefatos impactados`). Revise e aprove com o usuário.

## Estado 2 — Apply · Etapa A: Validate-Gap & Delta Spec
5. **Diagnóstico `Validate-Gap` (Brownfield)**:
   - Confronte o código atual do módulo tocado com a proposta aprovada, identificando o que já existe (*as-built*) vs. o que será adicionado/modificado/removido.
   - **Spec-on-Touch**: Em brownfield, se a área tocada nunca foi especificada, o delta `ADDED` inclui a spec *as-built* mínima daquela área.
6. **`delta-spec.md`**:
   - Escreva `delta-spec.md` com seções `ADDED` / `MODIFIED` / `REMOVED` contendo os requisitos em sintaxe canônica GEARS (`[Where <estático>] [While <dinâmico>] [When <gatilho>] the <subject> shall <behavior>`, keywords em inglês) e decisões `DES-xxx` que mudam. Peça aprovação ao usuário. O `Status` da delta só muda por decisão do usuário; liste os itens `Auto-Approved` (com `Motivo:`) ao pedir a aprovação.

## Estado 2 — Apply · Etapa B: Tasks & Gate Pré-Apply Passivo
7. **`tasks.md`**: Quebre a mudança em tarefas atômicas no `tasks.md` da mudança (`ID`, `Title`, `Goal`, `Related Requirements`, `Done When`, `Status: Pending`).
8. **Gate pré-apply**: Acione o **`sdd-validator` (100% passivo / read-only)** para conferir o delta contra a `constitution.md` e rastreabilidade.

## Estado 2 — Apply · Etapa C: Implementação
9. Implemente via `/sdd-workflow:implement` usando as tasks da mudança (`docs/sdd/changes/<nome>/tasks.md`).
   - **Subtarefa técnica** (refinamento do mesmo requisito): declare a task em `tasks.md` com todos os campos canônicos e informe o usuário antes de executá-la.
   - **Novo comportamento de negócio** ou alteração de requisito: atualize o `delta-spec.md` PRIMEIRO (`ADDED` ou `MODIFIED` em GEARS), obtenha consentimento do usuário, e só então crie a task.
   - NUNCA implemente código sem task formal no ledger (P1/P8).

## Estado 3 — Archive (Gate Passivo em 3 Camadas + Consolidação + Higiene Elástica)
Ao concluir TODAS as tasks da mudança:

a. **Gate Final Passivo em 3 Camadas**:
   - Rode a **Camada 0 Passiva** na raiz do projeto: `node "${CLAUDE_PLUGIN_ROOT}/scripts/check-ids.mjs" .` (siglas órfãs) + `node "${CLAUDE_PLUGIN_ROOT}/scripts/say-do-audit.mjs" .` (*Say-Do Gate*: testes executados com `exit code 0` após a última edição).
   - **Curto-circuito:** se houver siglas órfãs ou o Say-Do não retornar `VERIFIED_PASS`, **não acione o validador**: corrija/rode os testes e repita a Camada 0. `NO_EVIDENCE` não é aprovação — rode o comando oficial de testes (constitution §3) e re-audite.
   - Só com o piso limpo, acione o **`sdd-validator` (100% passivo)**, entregando a saída bruta dos dois comandos, para auditar a implementação contra os requisitos do delta em 2 estágios (`1. Conformidade GEARS` e `2. Qualidade & Infra Global`).
b. **Consolide na baseline**: incorpore os itens `ADDED`/`MODIFIED`/`REMOVED` do `delta-spec.md` nos artefatos centrais de `docs/sdd/` (`02-spec.md`, `03-requirements.md`, `04-domain-model.md`, `05-design.md`, `08-acceptance.md`, `09-traceability.md`). Itens `REMOVED` são removidos ou depreciados.
c. **Higiene de dívida e Paginação Elástica (*Overflow Sharding*)**:
   - Se a mudança resolveu débitos do `10-validation.md` (ou `10-validation-02.md`), **MOVA** essas entradas para `docs/sdd/archive/validation-log.md` com `"Fechado por: /change <nome>"`. O `10-validation.md` fica só com dívida ativa.
   - Se novos achados abertos fizerem `10-validation.md` atingir o gatilho de paginação (150 linhas ou 16.000 caracteres), crie/atualize `10-validation-02.md` e linke no topo.
   - Se, após sanar dívidas, o conteúdo de `10-validation-02.md` voltar a caber no `10-validation.md` principal (dentro dos dois tetos), **consolide no arquivo principal, remova o link e EXCLUA o arquivo `10-validation-02.md`**.
d. **Arquive a pasta**: mova `docs/sdd/changes/<nome>/` inteira para `docs/sdd/archive/<nome>/`.
e. **Atualize a memória**: registre o fechamento em `11-project-memory.md`. Mantenha apenas as ~5 mudanças mais recentes no memory; mudanças anteriores já consolidadas ficam referenciadas em `docs/sdd/archive/memory-history.md` (compactando e excluindo `11-project-memory-02.md` se não for mais necessário).

Não existe exceção de "hotfix": mesmo uma correção emergencial de uma linha entra como change (proposal enxuta → delta → task `In Progress` → gate → archive). O caminho leve já é o caminho rápido.

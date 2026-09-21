---
name: change
description: Ciclo de mudança SDD pós-baseline com delta specs (proposal → apply → archive). Use para nova feature, mudança de requisito, correção ou qualquer alteração em projeto com baseline SDD.
---

# SDD — Change (delta specs)

Nunca edite os artefatos base em docs/sdd/ diretamente após o baseline. Fluxo de 3 estados:

## 1. Proposal
Crie docs/sdd/changes/<kebab-name>/proposal.md (template no plugin): Why, What, Scope (in/out), Success Criteria, artefatos impactados. Revise com o usuário.

## 2. Delta spec
delta-spec.md com seções ADDED / MODIFIED / REMOVED contendo apenas os requisitos em sintaxe canônica GEARS (`[Where <estático>] [While <dinâmico>] [When <gatilho>] the <subject> shall <behavior>`, keywords em inglês) e decisões DES que mudam. Em brownfield, se a área tocada nunca foi especificada, o delta ADDED inclui a spec "as-built" mínima daquela área (spec-on-touch).

## 3. Tasks
tasks.md da mudança, mesmo formato do ledger (com Status e Done When). Este é o ledger exclusivo da mudança — tasks novas descobertas durante a implementação são adicionadas AQUI (ver regras abaixo).

## 4. Gate pré-apply
Acione **sdd-validator** para conferir o delta contra constitution e rastreabilidade.

## 5. Apply
Implemente via /sdd-workflow:implement usando as tasks da mudança (docs/sdd/changes/<nome>/tasks.md).

### Novas tasks descobertas durante o Apply
- **Subtarefa técnica** (refinamento do mesmo requisito): declare a task em tasks.md com todos os campos canônicos (ID, Title, Goal, Related Requirements, Done When, Status: Pending) e consulte/informe o usuário antes de executá-la.
- **Novo comportamento de negócio** ou alteração de requisito: atualize o delta-spec.md PRIMEIRO (ADDED ou MODIFIED em GEARS), obtenha consentimento do usuário, e só então crie a task.
- NUNCA implemente código "no improviso" sem task formal no ledger (P1/P8).

## 6. Archive (consolidação + arquivamento)
Ao concluir TODAS as tasks da mudança:

a. **Gate final**: rode a guarda mecânica (`check-ids.mjs`) e acione **sdd-validator** para auditar a implementação contra os requisitos do delta.
b. **Consolide na baseline**: incorpore os itens ADDED/MODIFIED/REMOVED do delta-spec nos artefatos centrais de docs/sdd/ (02-spec, 03-requirements, 05-design, 08-acceptance, 09-traceability). Itens REMOVED são removidos ou depreciados.
c. **Higiene de dívida**: se a mudança resolveu débitos do 10-validation.md, MOVA essas entradas para docs/sdd/archive/validation-log.md com "Fechado por: /change <nome>". O 10-validation fica só com dívida ativa.
d. **Arquive a pasta**: mova docs/sdd/changes/<nome>/ inteira para docs/sdd/archive/<nome>/.
e. **Atualize a memória**: registre o fechamento em 11-project-memory.md. Mantenha apenas as ~5 mudanças mais recentes no memory; mudanças anteriores já consolidadas ficam referenciadas em docs/sdd/archive/memory-history.md (append-only, consultável para investigação de bugs).

Hotfix emergencial: pode pular o delta, mas registre em 11-project-memory.md e confira se a spec continua verdadeira; se não, crie a mudança retroativa.

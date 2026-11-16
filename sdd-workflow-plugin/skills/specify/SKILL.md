---
name: specify
description: Fase de especificação SDD (00→03) — conduz Project Brief, Discovery, Spec (Intent Blocks) e Requirements (GEARS) com entrevista escopada de baixa fricção.
---

# SDD — Specify (Fases 00 a 03 — v2.1)

Delegue o trabalho ao subagent **`sdd-architect`**.

## Protocolo de Entrevista Escopada e Baixa Fricção:
1. **Escopo Estrito de Leitura**: Se este `specify` estiver sendo executado para uma feature em um projeto existente, inspecione **apenas os arquivos do domínio/módulo relacionado à feature** (nunca leia o repositório inteiro).
2. **Detecção de Escopo Excessivo (*Scope Slicing*)**: Se perceber que o escopo pedido pelo usuário abrange múltiplos domínios grandes de uma vez, proponha dividir em fases/milestones menores ou estreitar o escopo imediato e registrar o restante como escopo futuro em `10-validation.md` / `06-roadmap.md`.
3. **Poucas Perguntas Cirúrgicas**: Faça no máximo **3 a 5 perguntas objetivas por vez**, sempre trazendo uma **opção recomendada** baseada na `constitution.md` para não burocratizar a experiência do usuário.

## Fluxo:
1. Leia `constitution.md` (se não existir, rode antes `/sdd-workflow:init` ou `:adopt`), `11-project-memory.md` e o estado dos artefatos `00–03`.
2. Conduza a fase mais antiga incompleta, nesta ordem: `00-project-brief.md` → `01-discovery.md` → `02-spec.md` → `03-requirements.md`.
3. Em cada fase: resuma entendimento → conduza a entrevista enxuta de lacunas e pontos cegos (segurança, LGPD, NFRs, RTO/RPO, casos de falha) com recomendação padrão → gere o artefato em `docs/sdd/`.
4. **UM artefato por vez**; valide com o usuário antes de avançar (`Draft → Reviewed → Approved`). Só o usuário promove o `Status` do artefato (pode aprovar vários de uma vez); ao pedir a aprovação, liste os itens `Auto-Approved` e o `Motivo:` de cada um. Se avançar com a base em `Reviewed` (ainda não `Approved`), registre a dívida de maturidade (`Type: Maturity`) no `10-validation.md` com o snapshot dos IDs e do texto consumidos.
5. Ao concluir cada artefato: rode o subagent **`sdd-validator`** (gate passivo) e atualize `docs/sdd/11-project-memory.md` (respeitando o gatilho de paginação (150 linhas ou 7.000 caracteres) e paginação elástica `-02.md`).

Regras: Intent Blocks no `02-spec.md`; GEARS no `03-requirements.md` (keywords `Where`/`While`/`When`/`shall` em inglês); lacunas críticas → `PENDENTE DE DEFINIÇÃO` + `10-validation.md`. Nunca gere código nesta fase.

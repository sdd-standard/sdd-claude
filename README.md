# sdd-workflow — Plugin de Spec-Driven Development para Claude Code

> **A implementação oficial do padrão Spec-Driven Development (SDD Puro v2.1) para o ecossistema Claude Code (Anthropic).**

[![Standard: Pure SDD](https://img.shields.io/badge/Standard-Pure%20SDD%20v2.1-blue.svg)](https://github.com/sdd-standard/spec-driven-development)
[![Platform: Claude Code](https://img.shields.io/badge/Platform-Claude%20Code-purple.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## Sobre o Projeto & Propósito

Este repositório é o marketplace oficial do plugin **sdd-workflow** para **Claude Code** (CLI e VS Code).

O desenvolvimento assistido por IA revolucionou a velocidade criativa, mas projetos que escalam sem uma especificação estruturada sofrem com amnésia de contexto entre chats, alucinação de APIs e desvios sutis de regras de negócio.

O **Spec-Driven Development (SDD Puro v2.1)** traz o cinto de segurança e a governança necessária:
- **A especificação é a única fonte da verdade (P1/P2)**: O código deve expressá-la, nunca substituí-la.
- **Roteamento de Modelos por Papel**: Subagentes com papéis isolados (`Opus` para arquitetura e especificação; `Sonnet` para implementação e validação; `Haiku` para documentação técnica).
- **Entrevista Escopada, Baixa Fricção e Fatiamento de Escopo**: O arquiteto (`sdd-architect`) inspeciona **apenas** o código do domínio em pauta (jamais varre o repositório inteiro), realiza diagnóstico de `Validate-Gap`, faz poucas perguntas cirúrgicas com recomendação padrão e sugere fragmentar ou estreitar *changes* grandes demais.
- **Quality Gate 100% Passivo em 3 Camadas**:
  - **Camada 0 (Piso Mecânico Passivo):** Guarda determinística de IDs (`check-ids.mjs`) + comprovação de testes executados com `exit code 0` após a última edição.
  - **Camadas 1 e 2 (`sdd-validator` 100% Read-Only):** Auditoria separada em **Estágio 1 (Conformidade Estrita GEARS e Anti-Scope-Creep)** e **Estágio 2 (Qualidade, Constitution e Infra Global)**. Nenhuma camada do gate edita arquivos — apenas reporta divergências para o implementador corrigir.
- **Memória de Sessão e Paginação Elástica (P11)**: Hooks automáticos no `SessionStart` injetam o status vivo das tarefas e da memória sem poluir o histórico do chat, com teto de 150 linhas por arquivo, parágrafos curtos (máx. 4–5 linhas) e suporte a transbordo estruturado (`10-validation-02.md`, `11-project-memory-02.md`) que se auto-exclui quando as pendências são sanadas.

> 📖 **Manifesto e Fundamentação Teórica:**  
> Para entender a fundo os 11 Princípios Inegociáveis (P1–P11), a sintaxe GEARS, os Intent Blocks e a evolução contínua via Delta Specs, visite o nosso repositório de referência:  
> 👉 **[sdd-standard/spec-driven-development](https://github.com/sdd-standard/spec-driven-development)**

---

## Instalação no Claude Code

### Opção A — Marketplace via GitHub (Recomendado)
Para instalar diretamente no Claude Code a partir deste repositório oficial:

```text
claude
/plugin marketplace add sdd-standard/sdd-claude
/plugin install sdd-workflow@maurissi-sdd
```

### Opção B — Marketplace Local (Desenvolvimento / Teste)
Se você clonou este repositório localmente:

```text
claude
/plugin marketplace add <caminho-local-deste-repositorio>
/plugin install sdd-workflow
```

---

## Como Usar

O plugin disponibiliza 8 skills acessíveis diretamente como comandos no Claude Code:

| Comando | Fase / Função |
|---|---|
| `/sdd-workflow:init` | Inicia um novo projeto (Greenfield) com entrevista enxuta da Constitution e baseline flat `docs/sdd/00..11`. |
| `/sdd-workflow:adopt` | Adota o SDD em projetos existentes (Brownfield) via *Spec-on-Touch*. |
| `/sdd-workflow:specify` | Conduz Brief, Discovery, Intent Blocks e Requisitos em sintaxe canônica GEARS com entrevista escopada. |
| `/sdd-workflow:design` | Conduz diagnóstico `Validate-Gap`, modelo de domínio (DDD), arquitetura técnica (`DES-xxx`) e roadmap. |
| `/sdd-workflow:tasks` | Fatiamento em tarefas atômicas no ledger de execução (`07-tasks.md`), `AC-xxx` (`08`) e rastreabilidade (`09`). |
| `/sdd-workflow:implement` | Implementação guiada exclusivamente por tarefas ativas `In Progress` + Gate Passivo em 3 Camadas. |
| `/sdd-workflow:validate` | Dispara manualmente o Quality Gate 100% Passivo em 3 Camadas (`check-ids.mjs` + `sdd-validator`). |
| `/sdd-workflow:change` | Fluxo completo de Delta Specs (`proposal` ➔ `delta-spec` ➔ `tasks` ➔ `apply` ➔ `archive`). |

---

## Documentação Detalhada

Para conferir todos os detalhes técnicos sobre os subagentes (`sdd-architect`, `sdd-implementer`, `sdd-validator`, `sdd-doc-writer`), hooks determinísticos, guarda mecânica de IDs (`check-ids.mjs`), paginação elástica e ciclo de vida de dívida técnica, consulte a documentação completa em:

👉 **[sdd-workflow-plugin/README.md](sdd-workflow-plugin/README.md)**

---

## Licença

Distribuído sob a licença [MIT](./LICENSE).

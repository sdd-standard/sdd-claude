# sdd-workflow — Plugin de Spec-Driven Development para Claude Code

> **A implementação oficial do padrão Spec-Driven Development (SDD) para o ecossistema Claude Code (Anthropic).**

[![Standard: Pure SDD](https://img.shields.io/badge/Standard-Pure%20SDD%20v2.0-blue.svg)](https://github.com/sdd-standard/spec-driven-development)
[![Platform: Claude Code](https://img.shields.io/badge/Platform-Claude%20Code-purple.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## Sobre o Projeto & Propósito

Este repositório é o marketplace oficial do plugin **sdd-workflow** para **Claude Code** (CLI e VS Code).

O desenvolvimento assistido por IA revolucionou a velocidade criativa, mas projetos que escalam sem uma especificação estruturada sofrem com amnésia de contexto entre chats, alucinação de APIs e desvios sutis de regras de negócio.

O **Spec-Driven Development (SDD)** traz o cinto de segurança e a governança necessária:
- **A especificação é a única fonte da verdade**: O código deve expressá-la, nunca substituí-la.
- **Roteamento de Modelos por Papel**: Subagentes com papéis isolados (Opus para arquitetura e especificação; Sonnet para implementação e validação; Haiku para documentação técnica).
- **Quality Gates e Validação Blindada**: O subagente validador lê o código real, valida a rastreabilidade mecânica de IDs e impede avanço de milestones com débitos críticos em aberto.
- **Memória de Sessão (P11)**: Hooks automáticos no `session-start` injetam o status vivo das tarefas e da memória sem poluir o histórico do chat.

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

O plugin disponibiliza 7 skills acessíveis diretamente como comandos no Claude Code:

| Comando | Fase / Função |
|---|---|
| `/sdd-workflow:init` | Inicia um novo projeto (Greenfield) com entrevista da Constitution e baseline de specs. |
| `/sdd-workflow:adopt` | Adota o SDD em projetos existentes (Brownfield) via *Spec-on-Touch*. |
| `/sdd-workflow:specify` | Conduz Brief, Discovery, Intent Blocks e Requisitos em sintaxe canônica GEARS. |
| `/sdd-workflow:design` | Conduz o modelo de domínio, arquitetura técnica e decisões justificadas. |
| `/sdd-workflow:tasks` | Fatiamento em tarefas atômicas no ledger de execução (`07-tasks.md`). |
| `/sdd-workflow:implement` | Implementação guiada exclusivamente por tarefas ativas `In Progress`. |
| `/sdd-workflow:change` | Fluxo completo de Delta Specs (`proposal` ➔ `delta-spec` ➔ `tasks`). |

---

## Documentação Detalhada

Para conferir todos os detalhes técnicos sobre os subagentes (`sdd-architect`, `sdd-implementer`, `sdd-validator`, `sdd-doc-writer`), hooks determinísticos, guarda mecânica de IDs (`check-ids.mjs`) e ciclo de vida de dívida técnica, consulte a documentação completa em:

👉 **[sdd-workflow-plugin/README.md](sdd-workflow-plugin/README.md)**

---

## Licença

Distribuído sob a licença [MIT](./LICENSE).

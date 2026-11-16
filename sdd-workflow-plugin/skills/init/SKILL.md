---
name: init
description: Bootstrap SDD em projeto NOVO (greenfield) — cria docs/sdd/ (00..11 flat) a partir dos templates, constitution e CLAUDE.md. Use ao iniciar um projeto do zero com SDD.
---

# SDD — Init (Greenfield — v2.1)

1. **Verificação Inicial**: Confirme que `docs/sdd/` não existe (se existir, pare e sugira `/sdd-workflow:adopt` ou continuar de onde parou).
2. **Criação da Árvore Canônica Flat (`docs/sdd/`)**:
   Copie os templates de `${CLAUDE_PLUGIN_ROOT}/templates/` para o projeto:
   - `templates/specs/*` → `docs/sdd/` (instancia de `00-project-brief.md` até `11-project-memory.md` diretamente em `docs/sdd/`, incluindo `10-validation.md` e `11-project-memory.md` com suporte a paginação elástica `-02.md`).
   - `templates/archive/validation-log.md` → `docs/sdd/archive/`
   - `templates/archive/memory-history.md` → `docs/sdd/archive/`
   - Crie `docs/sdd/changes/` vazio.
3. **Entrevista Concisa da Constitution (Baixa Fricção)**:
   - Entreviste o usuário em até 3 a 5 perguntas diretas (com recomendações padrão) sobre: padrões de qualidade, política de testes, convenções de arquitetura, regras de segurança/compliance, stack fixa, git flow, política de docs e regras de instalação de deps.
   - Gere `docs/sdd/constitution.md` a partir de `templates/constitution.md.template`.
4. **`CLAUDE.md`**: Gere na raiz a partir de `templates/CLAUDE.md.template`, preenchendo nome/descrição do projeto, stack e git flow.
5. **Memória Inicial**: Inicialize `docs/sdd/11-project-memory.md` (estado: `"projeto inicializado, aguardando /sdd-workflow:specify"`).
6. **Próximo passo**: Oriente o usuário a rodar `/sdd-workflow:specify`.

Nunca pule a entrevista da `constitution.md` — ela governa todas as fases.

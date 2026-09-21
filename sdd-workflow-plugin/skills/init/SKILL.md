---
name: init
description: Bootstrap SDD em projeto NOVO (greenfield) — cria docs/sdd/ a partir dos templates, constitution e CLAUDE.md. Use ao iniciar um projeto do zero com SDD.
---

# SDD — Init (greenfield)

1. Confirme que docs/sdd/ não existe (se existir, pare e sugira /sdd-workflow:adopt ou continuar de onde parou).
2. Copie os templates de ${CLAUDE_PLUGIN_ROOT}/templates/ para o projeto:
   - templates/specs/* → docs/sdd/
   - templates/11-project-memory.md → docs/sdd/
   - templates/archive/validation-log.md → docs/sdd/archive/
   - templates/archive/memory-history.md → docs/sdd/archive/
   - crie docs/sdd/changes/ vazio.
3. **Constitution**: entreviste o usuário (padrões de qualidade, política de testes, convenções de arquitetura, regras de segurança/compliance, stack fixa, git flow, política de docs, regras de instalação de deps). Gere docs/sdd/constitution.md a partir do template.
4. **CLAUDE.md**: gere na raiz a partir de templates/CLAUDE.md.template, preenchendo nome/descrição do projeto e stack.
5. Inicialize 11-project-memory.md (estado: "projeto inicializado, aguardando /sdd-workflow:specify").
6. Próximo passo: /sdd-workflow:specify.

Nunca pule a entrevista da constitution — ela governa todas as fases.

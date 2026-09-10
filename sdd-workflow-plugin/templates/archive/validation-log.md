# Validation Log — histórico de dívidas resolvidas (append-only)

Cold storage. **NÃO é lido no protocolo de sessão** nem injetado automaticamente — consulte sob demanda (busca por ID). Aqui vivem os achados que já foram fechados; o `10-validation.md` guarda só o que está ATIVO.

Regras:

- Ao resolver uma dívida do `10-validation.md`, MOVA a entrada para cá (não deixe as duas cópias). O ID global é preservado e nunca reutilizado — a rastreabilidade ledger↔global↔log continua válida por busca de ID.
- Append-only: adicione ao fim, não reescreva o histórico.
- Cada entrada mantém o registro original + como foi fechada.

Formato de entrada:

```
VAL-nnn — <título curto>
Severity: <original>
Issue: <texto original>
Resolvido em: <data>
Fechado por: gate Mn de <feature> | /change <nome> | commit <hash>
Origem: <ponteiro original, ex.: gate M1 de auth (VAL-auth-M1-03)>
Nota: <o que efetivamente resolveu, 1 linha>
```

---
<!-- entradas resolvidas abaixo -->

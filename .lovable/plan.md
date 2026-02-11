

# Correcao Final: Remover dependencia de candidate_id nos inserts

## Problema

Os modulos **Expenses** e **Budget** ainda exigem `profile.candidate_id` para criar registros. Usuarios que possuem apenas `campanha_id` (modelo novo) ficam bloqueados ao tentar registrar despesas ou criar orcamentos.

## Mudancas

### 1. Expenses.tsx (src/pages/Expenses.tsx)

- **Linha 92**: Remover `!profile?.candidate_id` da validacao. Manter apenas `if (!campanhaId)`.
- **Linha 98**: Tornar `candidate_id` opcional. Se `profile.candidate_id` existir, envia-lo; caso contrario, usar um valor placeholder ou omitir (depende se a coluna e NOT NULL no banco).

Como a coluna `candidate_id` na tabela `expenses` e `NOT NULL`, sera necessario uma de duas abordagens:
  - **Opcao A (recomendada)**: Criar uma migration que torne `candidate_id` nullable em `expenses` e `budgets`
  - **Opcao B (paliativa)**: Usar um UUID fixo como fallback temporario

Recomendo a **Opcao A** com uma migration SQL:

```sql
ALTER TABLE expenses ALTER COLUMN candidate_id DROP NOT NULL;
ALTER TABLE budgets ALTER COLUMN candidate_id DROP NOT NULL;
```

### 2. useBudgetData.ts (src/components/budget/useBudgetData.ts)

- **Linha 65**: Remover `if (!profile?.candidate_id)`. Validar apenas `if (!campanhaId)`.
- **Linha 77**: Tornar `candidate_id` opcional no insert, usando `profile?.candidate_id || null`.

### 3. Migration SQL

Uma nova migration para tornar `candidate_id` nullable nas tabelas que ja migraram para `campanha_id`:

```sql
ALTER TABLE expenses ALTER COLUMN candidate_id DROP NOT NULL;
ALTER TABLE budgets ALTER COLUMN candidate_id DROP NOT NULL;
```

## Arquivos a Modificar

| Arquivo | Mudanca |
|---------|---------|
| `src/pages/Expenses.tsx` | Remover validacao de candidate_id no insert |
| `src/components/budget/useBudgetData.ts` | Remover validacao de candidate_id no insert |
| Nova migration SQL | Tornar candidate_id nullable em expenses e budgets |

## Resultado

Apos essa correcao, todos os modulos estarao 100% funcionais usando apenas `campanha_id`, sem dependencia residual de `candidate_id`.


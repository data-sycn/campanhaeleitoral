

# Plano: Completar Migração campanha_id nos Módulos Pendentes

## Resumo

Tres modulos ainda usam o modelo antigo de `candidate_id` e precisam ser migrados para filtrar por `campanha_id`: **Supporters**, **Budget (useBudgetData)** e **Reports**. Alem disso, o modulo **Expenses** precisa de ajuste no insert. Quatro paginas estao sem o componente `<Navbar />`.

---

## 1. Migrar Supporters.tsx

**Problema**: Busca apoiadores via `profiles.candidate_id` (modelo antigo). Deveria consultar a tabela `supporters` filtrada por `campanha_id`.

**Solucao**:
- Importar `campanhaId` do `useAuth()`
- Substituir a query de `profiles` pela tabela `supporters` com filtro `.eq("campanha_id", campanhaId)`
- Atualizar a interface para refletir os campos da tabela `supporters` (nome, telefone, email, bairro, cidade, geolocation)
- Adicionar `<Navbar />` no topo da pagina

---

## 2. Migrar useBudgetData.ts

**Problema**: Nao filtra por `campanha_id` na leitura; usa `candidate_id` no insert.

**Solucao**:
- Receber `campanhaId` como parametro ou obte-lo via `useAuth()`
- Adicionar `.eq("campanha_id", campanhaId)` na query de leitura
- No `createBudget`, usar `campanha_id` no insert ao inves de buscar `candidate_id` do profile
- Adicionar `<Navbar />` na pagina Budget.tsx

---

## 3. Migrar Reports.tsx

**Problema**: Queries de `expenses` e `budgets` nao filtram por `campanha_id`.

**Solucao**:
- Importar `campanhaId` do `useAuth()`
- Adicionar `.eq("campanha_id", campanhaId)` nas queries de expenses e budgets
- Adicionar `<Navbar />` no topo da pagina

---

## 4. Corrigir Insert do Expenses.tsx

**Problema**: O insert ainda busca `candidate_id` do profile (linha 91). Deveria usar apenas `campanha_id`.

**Solucao**:
- Remover a dependencia de `profile.candidate_id` para validacao
- Manter `candidate_id` no insert se a coluna ainda for obrigatoria no banco, mas usar `campanhaId` como filtro principal
- Adicionar `<Navbar />` no topo da pagina

---

## 5. Adicionar Navbar nas Paginas

As seguintes paginas nao possuem o componente `<Navbar />`:
- `Supporters.tsx` (linha 148 - falta wrapper)
- `Expenses.tsx` (linha 136 - falta Navbar)
- `Budget.tsx` (linha 47 - falta Navbar)
- `Reports.tsx` (linha 142 - falta Navbar)

Todas receberao o wrapper `<div className="min-h-screen bg-background"><Navbar />...</div>`.

---

## Arquivos a Modificar

| Arquivo | Mudanca |
|---------|---------|
| `src/pages/Supporters.tsx` | Migrar para `supporters` table + `campanha_id` + Navbar |
| `src/components/budget/useBudgetData.ts` | Adicionar filtro `campanha_id` |
| `src/pages/Budget.tsx` | Adicionar Navbar |
| `src/pages/Reports.tsx` | Adicionar filtro `campanha_id` + Navbar |
| `src/pages/Expenses.tsx` | Corrigir insert + Navbar |

---

## Resultado Esperado

Apos essa implementacao, **100% dos modulos** estarao filtrando por `campanha_id`, completando a migracao para o modelo Multi-Candidato (SaaS). Todas as paginas terao navegacao consistente com Navbar.




## Analysis: Campanha vs Candidato Redundancy

You are correct. The two entities overlap significantly:

| Campo | `candidates` | `campanhas` |
|-------|-------------|-------------|
| Nome | `name` | `nome` |
| Partido | `party` | `partido` |
| Cargo | `position` | `cargo` |
| Municipio | -- | `municipio` |
| UF | -- | `uf` |
| Numero | -- | `numero_candidato` |
| Cor/Logo | -- | `cor_primaria`, `logo_url` |

The `candidates` table is a legacy artifact. All business data (budgets, expenses, revenues, supporters, etc.) already uses `campanha_id`. The `candidates` table and its associated UI (AdminCandidates, AdminUserCandidates tabs) are dead weight.

## Plan: Unify into Campanhas

### Step 1 - Replace AdminCandidates with AdminCampanhas
- Create `AdminCampanhas.tsx` component that manages the `campanhas` table
- Form fields: nome, partido, cargo, numero_candidato, municipio, uf, cor_primaria
- Full CRUD (create, edit, delete with soft-delete via `deleted_at`)

### Step 2 - Replace AdminUserCandidates with AdminUserCampanhas
- Rename the "Acesso" tab to manage user-to-campanha associations
- Instead of linking users to `candidates`, update `profiles.campanha_id` directly
- Show a table of users with their current campanha assignment and allow changing it

### Step 3 - Update Admin.tsx tabs
- Replace "Candidatos" tab with "Campanhas" using the new component
- Replace "Acesso" tab to use the new campanha-based assignment
- Remove imports of legacy components

### Step 4 - Remove legacy components
- Delete `AdminCandidates.tsx`
- Delete `AdminUserCandidates.tsx`
- Remove `AdminCandidates` and `AdminUserCandidates` from `admin/index.ts`

### Technical notes
- No database migration needed; `campanhas` table already exists with all necessary fields
- RLS on `campanhas` already allows master full access and users to read their own
- The `candidates` table and `user_candidates` table remain in DB for backward compatibility but will no longer be used in the UI


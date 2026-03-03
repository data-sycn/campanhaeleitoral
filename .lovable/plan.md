

## Plan: Split "Permissões" into "Atribuir Função" + "Controle de Acesso"

### Overview

Divide the current Permissions tab into two sub-tabs and create a new access control system where admins configure which roles can access which modules/pages via a checkbox matrix, stored in the database. The system will enforce these rules at runtime.

### Database

**New table: `access_control`**
- `id` uuid PK
- `campanha_id` uuid NOT NULL (FK campanhas)
- `role` app_role NOT NULL
- `route` text NOT NULL (e.g. `/dashboard`, `/admin/permissions`)
- `allowed` boolean DEFAULT true
- `created_at`, `updated_at` timestamps
- UNIQUE constraint on `(campanha_id, role, route)`

RLS: Master full access; Admin can manage for their campanhas.

### Route/Module Registry

A static config defining the hierarchy of modules and sub-pages:

```text
dashboard        → /dashboard
financeiro       → /budget, /expenses
pessoas          → /supporters
municipios       → /municipios
checkin          → /checkin
resources        → /resources
roteiro          → /roteiro
mensagens        → /mensagens
reports          → /reports
historico        → /historico
roi              → /roi
admin            → /admin
  ├─ users       → /admin?tab=users
  ├─ permissions → /admin?tab=permissions
  ├─ campanhas   → /admin?tab=campanhas
  ├─ access      → /admin?tab=access
  ├─ vinculos    → /admin?tab=vinculos
  ├─ hierarchy   → /admin?tab=hierarchy
  └─ external    → /admin?tab=external-form
```

### UI Changes

1. **AdminPermissions.tsx** — becomes a container with two inner tabs:
   - **"Atribuir Função"** — current role assignment UI (unchanged)
   - **"Controle de Acesso"** — new checkbox matrix

2. **Access Control Matrix UI:**
   - Rows = roles (supporter, political_leader, local_coordinator, supervisor, coordinator, candidate; admin/master only if isMaster)
   - Columns = modules, expandable to show sub-pages
   - Each cell = a Checkbox (checked = allowed)
   - Changes save immediately via upsert to `access_control` table
   - Grouped by module with collapsible sub-routes (e.g., Admin tabs)

3. **Extract role assignment** into `AdminRoleAssignment.tsx` (move existing code from AdminPermissions)

4. **Create `AdminAccessControl.tsx`** — the new matrix component

### Runtime Enforcement

1. **New hook: `useAccessControl`** — fetches `access_control` rows for the user's campaign and roles, returns a `canAccess(route)` function
2. **ProtectedRoute** — after auth + PIN check, call `canAccess` for the current route; if denied, redirect to `/modulos` with a toast
3. **DashboardModuleGrid** and **ModuleSwitcher** — hide modules where `canAccess` returns false
4. **Admin.tsx** — hide tabs the user cannot access

### Default Behavior

When no `access_control` row exists for a role+route combination, default to **allowed** (backward compatible). The matrix shows all as checked initially. Unchecking creates/updates a row with `allowed=false`.

### Files to Create/Modify

| File | Action |
|------|--------|
| Migration SQL | Create `access_control` table |
| `src/components/admin/AdminRoleAssignment.tsx` | New — extracted from AdminPermissions |
| `src/components/admin/AdminAccessControl.tsx` | New — checkbox matrix |
| `src/components/admin/AdminPermissions.tsx` | Refactor into two sub-tabs |
| `src/hooks/useAccessControl.ts` | New — fetch + check access |
| `src/components/ProtectedRoute.tsx` | Add access control check |
| `src/components/dashboard/DashboardModuleGrid.tsx` | Filter by access |
| `src/components/navigation/ModuleSwitcher.tsx` | Filter by access |
| `src/pages/Admin.tsx` | Filter tabs by access |
| `src/integrations/supabase/types.ts` | Auto-updated after migration |




## Problema

Atualmente, a aba **Usuários** no Admin lista **todos** os perfis do sistema para qualquer Admin, porque a RLS de `profiles` permite que admins vejam tudo (`has_role(auth.uid(), 'admin')`). O comportamento correto é:

- **Master**: vê todos os usuários globalmente (já funciona)
- **Admin**: vê apenas usuários vinculados às mesmas campanhas que ele

## Abordagem

Filtrar no lado do cliente (pós-query) os usuários que compartilham campanha com o admin logado. A lógica:

1. Buscar as campanhas do admin atual (via `profiles.campanha_id` + `user_campanhas`)
2. Filtrar a lista de usuários para mostrar apenas aqueles cujo `campanha_id` está no conjunto de campanhas do admin
3. Master continua vendo tudo sem filtro

### Arquivo: `src/components/admin/AdminUsers.tsx`

- Importar `useAuth` para obter `isMaster`, `campanhaId`
- Adicionar query para buscar `user_campanhas` do admin atual (para saber todas as campanhas vinculadas)
- Após carregar os perfis, filtrar: se `isMaster`, mostrar todos; se admin, mostrar apenas perfis cujo `campanha_id` está nas campanhas do admin
- Também considerar usuários vinculados via `user_campanhas` (não apenas `profiles.campanha_id`)

### Detalhes técnicos

```
Query adicional:
  - user_campanhas WHERE user_id = auth.uid() → lista de campanha_ids do admin
  - profiles.campanha_id do admin atual

Filtro aplicado:
  - Se isMaster → sem filtro
  - Se admin → user.campanha_id IN [campanhas do admin] 
    OU user.id aparece em user_campanhas com alguma campanha do admin
```

Isso requer uma segunda query para buscar `user_campanhas` de todos os usuários (para cross-reference), ou filtrar usando os `campanha_id` dos profiles. A abordagem mais simples: filtrar pelo `campanha_id` do profile + buscar `user_campanhas` para ambos admin e usuários.




## Problema

O `selectedCampanhaId` é armazenado no `localStorage` e compartilhado entre sessões de diferentes usuários no mesmo navegador. Quando um Master seleciona a campanha "TITO" e depois o admin (vinculado apenas a "SIMULADA") loga no mesmo navegador, o valor antigo persiste e o hook `useActiveCampanhaId()` retorna a campanha errada.

O `useAuth.initUser` só faz auto-seleção quando `selectedCampanhaId` é `null` — nunca valida se o valor existente é permitido para o usuário atual.

## Solução

Adicionar validação no `initUser` (em `useAuth.tsx`) que, para usuários não-master, verifica se o `selectedCampanhaId` atual está dentro das campanhas permitidas. Se não estiver, limpa o valor e força a seleção correta.

### Alterações em `src/hooks/useAuth.tsx`

Na função `initUser`, após carregar perfil e roles:

1. **Para admin (não-master):** buscar `user_campanhas` do usuário e verificar se `selectedCampanhaId` está na lista. Se `profile.campanha_id` existir, incluí-lo também. Se o valor atual não estiver na lista permitida → limpar `selectedCampanhaId`.
2. **Para usuários comuns (não-admin, não-master):** se `selectedCampanhaId` existir e for diferente de `profile.campanha_id` → limpar.
3. **Master:** sem restrição (manter comportamento atual).

### Lógica simplificada

```text
initUser(userId):
  fetch profile + roles
  
  if master → keep selectedCampanhaId as-is
  else if admin:
    allowedIds = user_campanhas + profile.campanha_id
    if selectedCampanhaId NOT in allowedIds → clear it
    if no selectedCampanhaId and 1 allowed → auto-select
  else (regular user):
    if selectedCampanhaId != profile.campanha_id → clear it
```

### Escopo adicional: limpar localStorage no signOut

Na função `signOut`, remover `selectedCampanhaId` do `localStorage` para evitar vazamento entre sessões de usuários diferentes.

### Arquivos alterados
- `src/hooks/useAuth.tsx` — validação no `initUser` + limpeza no `signOut`

Nenhuma migração de banco necessária.


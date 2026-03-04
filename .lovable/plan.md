

## Plano: Controle de Widgets do Dashboard por Função e Usuário

### Situacao Atual
- Widgets do dashboard sao ativados/desativados globalmente por campanha (tabela `dashboard_widget_config`)
- O controle de acesso por funcao (AdminAccessControl) e por usuario (AdminUserAccessControl) usa o `ROUTE_REGISTRY` para listar modulos/paginas
- Os widgets nao aparecem nessas telas de permissao

### Solucao
Registrar cada widget como sub-rota do Dashboard no `ROUTE_REGISTRY`. Assim, eles aparecerao automaticamente nas telas existentes "Por Funcao" e "Por Usuario" sem nenhuma alteracao nesses componentes.

### Alteracoes

**1. `src/lib/routeRegistry.ts`**
- Transformar a entrada "dashboard" de item simples para item com `children`, adicionando uma sub-rota para cada widget:
  - `/dashboard/alertas` - Alertas de Recorrencia
  - `/dashboard/ranking` - Ranking de Efetividade
  - `/dashboard/heatmap` - Mapa de Calor
  - `/dashboard/simultaneidade` - Simultaneidade
  - `/dashboard/heatmap-apoiadores` - Heatmap Apoiadores

**2. `src/pages/Dashboard.tsx`**
- Importar `useAccessControl` e, para cada widget, verificar **ambas** as condicoes:
  - `isWidgetEnabled(key)` (toggle global da campanha)
  - `canAccess('/dashboard/heatmap')` (permissao por funcao/usuario)
- Widget so aparece se ambos retornarem `true`

**3. Nenhuma alteracao nos componentes de permissao**
- `AdminAccessControl` e `AdminUserAccessControl` ja iteram sobre `ROUTE_REGISTRY` e seus `children`, entao os novos widgets aparecerão automaticamente como sub-itens expansiveis do Dashboard

### Resultado
- Admin > Permissoes > "Por Funcao": Dashboard tera seta expansivel mostrando cada widget com checkbox por funcao
- Admin > Permissoes > "Por Usuario": mesma estrutura com ciclo Herda/Bloqueado/Permitido
- Admin > Dashboard: toggle global continua funcionando como master switch


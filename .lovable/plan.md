
# Reconstruir Dashboard Principal do CampanhaGov

## Resumo

Reestruturar o Dashboard com 4 grandes melhorias: Seletor de Campanha para Master, Mapa de Calor de apoiadores, grafico Orcamento vs Gasto Real, e Linha do Tempo de Auditoria.

---

## 1. Criar View `v_execucao_orcamentaria` no Banco de Dados

A view nao existe ainda. Sera criada via migracao SQL:

```sql
CREATE OR REPLACE VIEW public.v_execucao_orcamentaria AS
SELECT 
  b.id AS budget_id,
  b.candidate_id,
  b.year,
  b.total_planned,
  b.campanha_id,
  COALESCE(SUM(e.amount), 0) AS total_spent,
  b.total_planned - COALESCE(SUM(e.amount), 0) AS saldo,
  CASE 
    WHEN b.total_planned > 0 
    THEN ROUND((COALESCE(SUM(e.amount), 0) / b.total_planned) * 100, 2)
    ELSE 0 
  END AS percentual_executado
FROM budgets b
LEFT JOIN expenses e ON e.candidate_id = b.candidate_id
WHERE b.active = true
GROUP BY b.id, b.candidate_id, b.year, b.total_planned, b.campanha_id;
```

Tambem sera necessario aplicar RLS na view ou criar uma funcao RPC para acesso seguro.

---

## 2. Seletor de Campanha no Cabecalho (Master Only)

**Novo componente**: `src/components/dashboard/CampaignSelector.tsx`

- Dropdown no cabecalho do Dashboard (abaixo do titulo, nao na Navbar)
- Visivel apenas para usuarios com role `master`
- Consulta a tabela `campanhas` para listar todas as campanhas disponiveis
- Ao selecionar, filtra todos os dados do dashboard pela `campanha_id` escolhida
- Estado gerenciado localmente no Dashboard com `useState`

**Dados**: `SELECT id, nome, partido, municipio, uf FROM campanhas WHERE deleted_at IS NULL`

---

## 3. Widget de Mapa de Calor de Apoiadores

**Novo componente**: `src/components/dashboard/SupportersHeatmap.tsx`

- Usa a tabela `supporters` (colunas `latitude`, `longitude`)
- Como nao podemos usar bibliotecas de mapas nativos (Leaflet, Google Maps) sem instalar dependencias, sera implementado como um **mapa visual simplificado**:
  - Tabela agrupada por cidade/bairro com contagem de apoiadores
  - Barras horizontais representando concentracao
  - Indicador visual de "calor" com gradiente de cores
- Caso futuramente queira um mapa real, sera necessario instalar `react-leaflet`
- Consulta: `SELECT cidade, bairro, COUNT(*) as total FROM supporters WHERE campanha_id = ? GROUP BY cidade, bairro ORDER BY total DESC`

---

## 4. Grafico Orcamento vs Gasto Real

**Novo componente**: `src/components/dashboard/BudgetExecutionChart.tsx`

- Consome a view `v_execucao_orcamentaria` via Supabase
- Grafico de barras lado a lado (Recharts - ja instalado) mostrando:
  - Barra verde: `total_planned` (Orcamento)
  - Barra vermelha: `total_spent` (Gasto Real)
- Substitui o grafico atual que usa dados mockados
- Inclui tooltips com valores formatados em BRL

---

## 5. Aba de Linha do Tempo de Auditoria

**Novo componente**: `src/components/dashboard/AuditTimeline.tsx`

- Nova aba "Auditoria" nas tabs do Dashboard
- Consulta as ultimas 50 acoes da tabela `audit_log`
- Layout em timeline vertical com:
  - Icone por tipo de acao (INSERT, UPDATE, DELETE)
  - Tabela afetada (`table_name`)
  - Data/hora formatada (`created_at`)
  - Resumo dos dados alterados (campo `new_data` simplificado)
- Master ve todos os logs; outros usuarios veem apenas os proprios

---

## 6. Reestruturar o Dashboard.tsx

O arquivo principal sera atualizado para:

- Adicionar 3 abas: "Visao Geral", "Graficos", "Auditoria"
- Integrar `CampaignSelector` no topo (condicional para Master)
- Substituir dados mockados pelo hook atualizado
- Adicionar os novos componentes nas abas correspondentes

---

## 7. Atualizar `useDashboardData.ts`

- Adicionar parametro opcional `campanhaId` para filtrar por campanha (Master)
- Adicionar fetch da view `v_execucao_orcamentaria`
- Adicionar fetch de `supporters` agrupados por cidade
- Adicionar fetch de `audit_log`

---

## Arquivos a Criar/Modificar

| Arquivo | Acao |
|---------|------|
| Migration SQL (v_execucao_orcamentaria) | Criar |
| `src/components/dashboard/CampaignSelector.tsx` | Criar |
| `src/components/dashboard/SupportersHeatmap.tsx` | Criar |
| `src/components/dashboard/BudgetExecutionChart.tsx` | Criar |
| `src/components/dashboard/AuditTimeline.tsx` | Criar |
| `src/components/dashboard/useDashboardData.ts` | Modificar |
| `src/pages/Dashboard.tsx` | Modificar |
| `src/integrations/supabase/types.ts` | Atualizar (pos-migracao) |

---

## Observacao sobre o Mapa de Calor

A tabela `supporters` possui colunas `latitude`, `longitude` e `geolocation`, porem atualmente nao ha registros. O componente sera construido pronto para funcionar assim que dados forem inseridos. Para um mapa interativo real (tipo Google Maps/Leaflet), sera necessaria a instalacao de uma biblioteca adicional em um passo futuro.

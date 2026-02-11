

# Plano de Implementacao - Funcionalidades Faltantes

Apos analisar o documento "Sistema de Campanha" e o codigo atual, identifiquei as funcionalidades que ainda nao foram implementadas. Seguem organizadas por prioridade.

---

## Status Atual vs. Documento

| Funcionalidade | Status |
|---|---|
| Check-in de Rua com trava de simultaneidade | Implementado |
| Feedback de campo (clima, demandas, liderancas) | Implementado |
| Dossie de Visita por cidade | Implementado |
| Solicitacao de Recursos vinculada a localidade | Implementado |
| Mapa de Calor (Leaflet) | Implementado |
| Alertas de Recorrencia | Implementado |
| Monitor de Simultaneidade | Implementado |
| Ranking de Efetividade | Implementado |
| Orcamento + Despesas (Financeiro) | Implementado |
| Sincronizacao offline (check-in) | Implementado (basico) |
| **Planejamento de Roteiro** | Nao implementado |
| **Comunicacao Direta para equipes** | Nao implementado |
| **Hierarquia de Liderancas (UI)** | Nao implementado (DB pronto) |
| **Inventario de Materiais** | Nao implementado |
| **ROI Pos-Campanha (importar votacao)** | Nao implementado |
| **Exportacao PDF real** | Nao implementado (stub) |

---

## Fase 1 - Gestao Operacional (Coordenador)

### 1.1 Planejamento de Roteiro
Permite ao coordenador designar equipes para bairros/ruas especificas.

- Criar tabela `route_assignments` (campanha_id, user_id, street_id, data_planejada, status)
- Nova pagina ou aba no Check-in com visao de coordenador
- Interface: selecionar usuario + selecionar ruas/bairro + data
- Visualizacao de quem esta alocado onde

### 1.2 Hierarquia de Liderancas (UI)
O campo `parent_id` ja existe na tabela `profiles`. Falta a interface.

- No modulo Admin, nova aba "Hierarquia"
- Arvore visual mostrando Lider > Equipe
- Permite definir quem responde a quem
- Filtrar dados por equipe do lider

### 1.3 Comunicacao Direta
Envio de orientacoes do coordenador para equipes de campo.

- Criar tabela `messages` (campanha_id, from_user, to_user, to_role, conteudo, lida, created_at)
- Widget de notificacoes na Navbar (sino) com mensagens nao lidas
- Interface simples para enviar orientacao baseada em feedbacks recebidos

---

## Fase 2 - Controle de Materiais

### 2.1 Inventario de Materiais
Controle do que foi enviado e usado por municipio.

- Criar tabela `material_inventory` (campanha_id, tipo, descricao, cidade, quantidade_enviada, quantidade_reportada, created_at)
- Nova aba dentro do modulo Recursos: "Inventario"
- Registrar envio de materiais (santinhos, adesivos) por cidade
- Equipe de campo reporta uso
- Dashboard mostra: "Enviamos X, usaram Y" por municipio

---

## Fase 3 - Inteligencia Pos-Campanha

### 3.1 ROI Politico (Pos-Campanha)
Cruzamento de investimento com resultado eleitoral.

- Criar tabela `election_results` (campanha_id, cidade, bairro, secao, votos_obtidos, total_eleitores)
- Interface para importar dados de votacao (CSV/manual)
- Calculos automaticos: custo por voto, eficiencia por municipio
- Comparativo visual: investimento vs. votos por cidade
- Nova aba "Pos-Campanha" no Dashboard ou Relatorios

### 3.2 Exportacao PDF Real
Gerar PDF do dossie e relatorios financeiros.

- Usar biblioteca como `jspdf` + `html2canvas` ou `@react-pdf/renderer`
- Botao "Exportar PDF" no Dossie de Visita gera resumo completo
- Botao "Exportar PDF" nos Relatorios gera relatorio financeiro
- Conteudo: KPIs, graficos, demandas, liderancas

---

## Detalhes Tecnicos

### Novas Tabelas de Banco

```text
route_assignments
  - id (UUID, PK)
  - campanha_id (UUID, FK)
  - assigned_by (UUID, FK profiles)
  - assigned_to (UUID, FK profiles)
  - street_id (UUID, FK streets)
  - data_planejada (DATE)
  - status (TEXT: pendente/em_andamento/concluido)
  - created_at (TIMESTAMPTZ)

messages
  - id (UUID, PK)
  - campanha_id (UUID, FK)
  - from_user (UUID, FK profiles)
  - to_user (UUID, nullable)
  - to_role (TEXT, nullable)
  - conteudo (TEXT)
  - lida (BOOLEAN default false)
  - created_at (TIMESTAMPTZ)

material_inventory
  - id (UUID, PK)
  - campanha_id (UUID, FK)
  - tipo (TEXT)
  - descricao (TEXT)
  - cidade (TEXT)
  - quantidade_enviada (INTEGER)
  - quantidade_reportada (INTEGER default 0)
  - created_at (TIMESTAMPTZ)

election_results
  - id (UUID, PK)
  - campanha_id (UUID, FK)
  - cidade (TEXT)
  - bairro (TEXT, nullable)
  - secao (TEXT, nullable)
  - votos_obtidos (INTEGER)
  - total_eleitores (INTEGER)
  - created_at (TIMESTAMPTZ)
```

### Arquivos a Criar/Editar

| Arquivo | Acao |
|---|---|
| Migrations SQL (4 tabelas + RLS) | Criar |
| `src/pages/RouteAssignment.tsx` | Criar - Planejamento de roteiro |
| `src/components/admin/AdminHierarchy.tsx` | Criar - Arvore de liderancas |
| `src/pages/Admin.tsx` | Editar - Adicionar aba Hierarquia |
| `src/components/resources/MaterialInventory.tsx` | Criar - Inventario |
| `src/pages/Resources.tsx` | Editar - Adicionar aba Inventario |
| `src/components/reports/ElectionResults.tsx` | Criar - ROI pos-campanha |
| `src/components/reports/PdfExporter.tsx` | Criar - Gerador PDF |
| `src/pages/Reports.tsx` | Editar - Adicionar aba Pos-Campanha + botao PDF funcional |
| `src/components/navigation/NavNotifications.tsx` | Editar - Mensagens |
| `src/App.tsx` | Editar - Adicionar rota /roteiro |
| `src/components/dashboard/DashboardModuleGrid.tsx` | Editar - Adicionar modulo Roteiro |

### Ordem de Implementacao Sugerida

1. Planejamento de Roteiro (mais impacto operacional imediato)
2. Hierarquia de Liderancas
3. Inventario de Materiais
4. Comunicacao Direta
5. ROI Pos-Campanha
6. Exportacao PDF


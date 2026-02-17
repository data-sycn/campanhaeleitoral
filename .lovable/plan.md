

# Fase 3 — Itens Pendentes do Plano Complementar

Implementacao dos tres modulos restantes: Comunicacao Direta, ROI Politico (Custo por Voto), e reforco Offline First.

---

## 1. Comunicacao Direta (Orientacoes para Equipes)

Sistema de mensagens/orientacoes do Coordenador para as equipes de campo, vinculadas a campanha.

### Banco de dados

Nova tabela `team_messages`:

| Coluna | Tipo | Detalhes |
|---|---|---|
| id | UUID | PK, gen_random_uuid() |
| campanha_id | UUID | NOT NULL |
| sender_id | UUID | NOT NULL (quem enviou) |
| cidade | TEXT | NULL (filtro opcional por cidade) |
| titulo | TEXT | NOT NULL |
| conteudo | TEXT | NOT NULL |
| prioridade | TEXT | DEFAULT 'normal' (normal, urgente) |
| created_at | TIMESTAMPTZ | DEFAULT now() |

RLS: mesmo padrao campanha_id. Master/admin podem inserir; todos da campanha podem ler.

### Interface

- **Criar** `src/pages/Messages.tsx` — Pagina com duas visoes:
  - Coordenador/Admin: formulario para enviar orientacoes (titulo, conteudo, cidade opcional, prioridade)
  - Equipe de campo: lista de mensagens recebidas, ordenadas por data, com badge de prioridade
- **Criar** `src/components/navigation/NavNotifications.tsx` (ou editar se ja existe) — Indicador de mensagens nao lidas no Navbar
- **Editar** `src/App.tsx` — Adicionar rota `/mensagens`
- **Editar** `src/components/dashboard/DashboardModuleGrid.tsx` — Adicionar card "Mensagens" no grid

---

## 2. ROI Politico / Custo por Voto

Modulo pos-campanha para cruzar dados de votacao com investimento por cidade.

### O que ja existe

- Tabela `votes_raw` com votos por secao/zona
- Tabela `votes_agg` com total de votos por candidato
- Tabela `expenses` e `resource_requests` com custos por cidade
- Tabela `street_checkins` com acoes por cidade

### Interface

- **Criar** `src/pages/ROI.tsx` — Dashboard de ROI com:
  - Resumo por cidade: votos obtidos, total investido (expenses + resource_requests aprovados), custo por voto
  - Tabela comparativa ordenavel
  - Grafico de barras (Recharts) comparando investimento vs. votos por cidade
  - Badge visual: cidades eficientes (verde) vs. cidades caras (vermelho)
- **Editar** `src/App.tsx` — Adicionar rota `/roi`
- **Editar** `src/components/dashboard/DashboardModuleGrid.tsx` — Adicionar card "ROI" (visivel apenas para master/admin)

---

## 3. Reforco Offline First

Atualmente o offline so cobre check-ins (localStorage queue em StreetCheckin). O plano exige cobertura para feedbacks e solicitacoes de recursos tambem.

### O que sera feito

- **Criar** `src/lib/offlineSync.ts` — Servico generico de fila offline:
  - Funcao `enqueueOffline(table, payload)` para salvar em localStorage
  - Funcao `syncOfflineQueue()` para tentar enviar pendencias ao Supabase
  - Listener de `online` event para sincronizar automaticamente
- **Editar** `src/pages/StreetCheckin.tsx` — Migrar logica atual de offline para usar `offlineSync`
- **Editar** `src/pages/Resources.tsx` — Adicionar suporte offline nas solicitacoes de recurso
- **Editar** `src/main.tsx` — Registrar listener global de reconexao para disparar `syncOfflineQueue`
- Adicionar indicador visual no Navbar quando houver itens pendentes de sincronizacao

---

## Resumo de Arquivos

| Arquivo | Acao |
|---|---|
| Migration SQL | Criar tabela `team_messages` + RLS |
| `src/pages/Messages.tsx` | Criar |
| `src/pages/ROI.tsx` | Criar |
| `src/lib/offlineSync.ts` | Criar |
| `src/App.tsx` | Editar (adicionar rotas /mensagens e /roi) |
| `src/components/dashboard/DashboardModuleGrid.tsx` | Editar (cards Mensagens e ROI) |
| `src/pages/StreetCheckin.tsx` | Editar (migrar offline para offlineSync) |
| `src/pages/Resources.tsx` | Editar (adicionar offline) |
| `src/main.tsx` | Editar (listener global de sync) |
| `src/components/Navbar.tsx` | Editar (indicador offline queue) |

### Ordem de execucao
1. Migration para `team_messages`
2. Criar `offlineSync.ts` e integrar em StreetCheckin + Resources + main.tsx
3. Criar `Messages.tsx` e integrar nas rotas e grid
4. Criar `ROI.tsx` e integrar nas rotas e grid


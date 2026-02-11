

# Plano: Implementar Funcionalidades Pendentes do PDF

## Resumo da Auditoria

De 24 requisitos mapeados no documento, **15 estao implementados** e **9 estao ausentes ou parciais**. Tambem ha um residuo de codigo legado no `useAuth.tsx` que referencia a tabela `candidates`.

---

## Fase 1: Correcoes Urgentes (Legado)

### 1.1 Limpar useAuth.tsx
O `fetchProfile` (linhas 92-101) ainda tenta buscar dados na tabela `candidates`. Isso pode causar erros silenciosos. Remover esse bloco e a interface `SelectedCandidate`, simplificando o auth para usar apenas `campanha_id`.

**Arquivo**: `src/hooks/useAuth.tsx`

---

## Fase 2: Inteligencia de Campo (Feedback Estruturado)

### 2.1 Adicionar campos de feedback ao Check-in
Criar campos estruturados no encerramento do check-in:
- `feedback_clima`: enum (receptivo, neutro, hostil)
- `feedback_demandas`: texto livre (o que o povo pediu)
- `liderancas_identificadas`: texto (nomes de lideranças locais)

**Migration SQL**: Adicionar colunas `feedback_clima`, `feedback_demandas`, `liderancas_identificadas` na tabela `street_checkins`.

**Arquivo**: `src/pages/StreetCheckin.tsx` - Adicionar formulario de feedback ao encerrar check-in.

### 2.2 Status de Cobertura por Rua
Adicionar coluna `status_cobertura` na tabela `streets` com valores: `nao_visitada`, `em_visitacao`, `concluida`, `necessita_retorno`. Atualizar automaticamente via trigger quando um check-in e iniciado/encerrado.

**Migration SQL**: Coluna + trigger.
**Arquivo**: `src/pages/StreetCheckin.tsx` - Exibir badge de status por rua.

---

## Fase 3: Dossie de Visita (Inteligencia de Discurso)

### 3.1 Criar tela "Dossie do Municipio"
Nova pagina `/dossie/:cidade` que compila:
- Ultimos feedbacks das ruas visitadas naquela cidade
- Demandas mais citadas
- Liderancas identificadas
- Percentual de cobertura territorial

**Novo arquivo**: `src/pages/DossieVisita.tsx`
**Dados**: Query em `street_checkins` + `streets` filtrado por cidade e campanha_id.

---

## Fase 4: Alertas e Rankings

### 4.1 Alerta de Recorrencia
No Dashboard, adicionar widget que mostre ruas/comunidades com ultimo check-in ha mais de X dias (configuravel). Query simples com `MAX(ended_at)` agrupado por street_id.

### 4.2 Ranking de Efetividade
Widget comparando equipes: ruas visitadas vs. custo (cruzando `street_checkins` com `resource_requests` por cidade). Exibir como tabela ranqueada no Dashboard.

**Arquivo**: `src/pages/Dashboard.tsx` - Novos widgets na aba "Visao Geral".

---

## Fase 5: Inventario e Logistica

### 5.1 Expandir Gestao de Recursos
Adicionar campo `quantidade_utilizada` na tabela `resource_requests` para rastrear consumo (ex: "50 mil santinhos enviados, 30 mil usados").

**Migration SQL**: Nova coluna.
**Arquivo**: `src/pages/Resources.tsx` - Botao "Registrar Uso" para atualizar quantidade consumida.

---

## Fase 6: Funcionalidades Futuras (Pos-Campanha)

Estas funcionalidades sao complexas e podem ser planejadas para uma fase posterior:
- **Planejamento de Roteiro**: Designar equipes a bairros especificos
- **Comunicacao Direta**: Chat/mensagens entre Coordenador e equipes
- **Modulo Pos-Campanha**: Importacao de dados de votacao e calculo de "Custo por Voto"

---

## Arquivos a Modificar/Criar

| Arquivo | Acao |
|---------|------|
| `src/hooks/useAuth.tsx` | Remover referencia a tabela `candidates` |
| `src/pages/StreetCheckin.tsx` | Adicionar feedback estruturado + status de cobertura |
| `src/pages/DossieVisita.tsx` | **NOVO** - Dossie por municipio |
| `src/pages/Dashboard.tsx` | Widgets de alerta de recorrencia + ranking |
| `src/pages/Resources.tsx` | Campo de quantidade utilizada |
| `src/App.tsx` | Nova rota `/dossie/:cidade` |
| 2-3 migrations SQL | Novas colunas e triggers |

## Ordem de Implementacao

1. Limpar legado useAuth (5 min)
2. Feedback estruturado no check-in (30 min)
3. Status de cobertura por rua (20 min)
4. Dossie de Visita (30 min)
5. Alertas + Ranking no Dashboard (20 min)
6. Inventario expandido (15 min)


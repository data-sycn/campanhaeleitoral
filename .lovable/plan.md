

# Fase 1.2 + 2.1 — Hierarquia de Liderancas + Inventario de Materiais

---

## 1. Hierarquia de Liderancas (UI)

O campo `parent_id` ja existe na tabela `profiles`. Nao ha mudancas no banco.

### O que sera feito

- **Criar** `src/components/admin/AdminHierarchy.tsx`
  - Busca todos os perfis da campanha atual (via profiles + user_roles)
  - Exibe arvore visual agrupada: Lider no topo, membros abaixo (usando Collapsible)
  - Dropdown (Select) em cada membro para definir/alterar o `parent_id`
  - Atualiza `profiles.parent_id` via Supabase ao selecionar lider

- **Editar** `src/pages/Admin.tsx`
  - Importar AdminHierarchy e icone GitBranch
  - Adicionar quinta aba "Hierarquia"
  - Alterar grid de `grid-cols-4` para `grid-cols-5`

- **Editar** `src/components/admin/index.ts`
  - Exportar AdminHierarchy

---

## 2. Inventario de Materiais

### Banco de dados (nova tabela)

Criar migration com tabela `material_inventory`:

| Coluna | Tipo | Detalhes |
|---|---|---|
| id | UUID | PK, gen_random_uuid() |
| campanha_id | UUID | NOT NULL |
| tipo | TEXT | NOT NULL (santinhos, adesivos, bandeiras, etc.) |
| descricao | TEXT | |
| cidade | TEXT | NOT NULL |
| quantidade_enviada | INTEGER | DEFAULT 0 |
| quantidade_reportada | INTEGER | DEFAULT 0 |
| created_by | UUID | |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| updated_at | TIMESTAMPTZ | DEFAULT now() |

RLS: master acessa tudo, demais usuarios filtram por campanha_id (mesmo padrao das demais tabelas).

### Interface

- **Editar** `src/pages/Resources.tsx`
  - Envolver o conteudo atual em Tabs com duas abas: "Solicitacoes" (atual) e "Inventario" (novo)
  - O botao "Nova Solicitacao" fica visivel apenas na aba Solicitacoes

- **Criar** `src/components/resources/MaterialInventory.tsx`
  - Formulario para registrar envio de material (tipo, descricao, cidade, quantidade_enviada)
  - Lista de materiais com barra de progresso (Progress) mostrando quantidade_reportada / quantidade_enviada
  - Botao para equipe de campo atualizar `quantidade_reportada`
  - Tipos pre-definidos: Santinhos, Adesivos, Bandeiras, Camisetas, Outros

---

## Resumo de Arquivos

| Arquivo | Acao |
|---|---|
| Migration SQL | Criar tabela `material_inventory` + RLS |
| `src/components/admin/AdminHierarchy.tsx` | Criar |
| `src/components/admin/index.ts` | Editar (exportar) |
| `src/pages/Admin.tsx` | Editar (5a aba) |
| `src/components/resources/MaterialInventory.tsx` | Criar |
| `src/pages/Resources.tsx` | Editar (adicionar Tabs) |

### Ordem de execucao
1. Migration para `material_inventory`
2. Criar `AdminHierarchy.tsx` e integrar em Admin
3. Criar `MaterialInventory.tsx` e integrar em Resources


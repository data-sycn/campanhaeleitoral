

# Fase 1.2 + 2.1 — Hierarquia de Liderancas + Inventario de Materiais

Vamos implementar os proximos dois itens do plano em sequencia.

---

## 1. Hierarquia de Liderancas (UI)

O campo `parent_id` ja existe na tabela `profiles`. Falta apenas a interface.

### O que sera feito

- Criar componente `src/components/admin/AdminHierarchy.tsx`
  - Lista todos os perfis da campanha com seus papeis
  - Mostra arvore visual: Lider > membros da equipe
  - Permite definir `parent_id` de um usuario (quem ele responde)
  - Dropdown para selecionar o lider de cada membro
- Editar `src/pages/Admin.tsx`
  - Adicionar quinta aba "Hierarquia" com icone `GitBranch`
  - Atualizar grid de 4 para 5 colunas

### Sem mudancas no banco
A tabela `profiles` ja possui `parent_id` e a RLS permite admins verem todos os perfis e usuarios atualizarem o proprio perfil. Admins poderao atualizar via funcao ou ajuste de RLS se necessario.

---

## 2. Inventario de Materiais

### Banco de dados (nova tabela)

Criar tabela `material_inventory` com:
- `id` (UUID, PK)
- `campanha_id` (UUID, not null)
- `tipo` (TEXT — santinhos, adesivos, bandeiras, etc.)
- `descricao` (TEXT)
- `cidade` (TEXT)
- `quantidade_enviada` (INTEGER, default 0)
- `quantidade_reportada` (INTEGER, default 0)
- `created_by` (UUID)
- `created_at`, `updated_at` (TIMESTAMPTZ)

RLS: mesmo padrao — master acessa tudo, usuarios acessam pela campanha.

### Interface

- Editar `src/pages/Resources.tsx` para adicionar sistema de abas:
  - Aba "Solicitacoes" (conteudo atual)
  - Aba "Inventario" (novo)
- Criar `src/components/resources/MaterialInventory.tsx`
  - Formulario para registrar envio de materiais por cidade
  - Lista de materiais com indicador visual: enviado vs. reportado
  - Barra de progresso mostrando uso percentual
  - Equipe de campo pode atualizar `quantidade_reportada`

---

## Detalhes Tecnicos

### Arquivos a criar
| Arquivo | Descricao |
|---|---|
| Migration SQL | Tabela `material_inventory` + RLS |
| `src/components/admin/AdminHierarchy.tsx` | Arvore de hierarquia |
| `src/components/resources/MaterialInventory.tsx` | Inventario de materiais |

### Arquivos a editar
| Arquivo | Mudanca |
|---|---|
| `src/pages/Admin.tsx` | Adicionar aba Hierarquia (5 abas) |
| `src/components/admin/index.ts` | Exportar AdminHierarchy |
| `src/pages/Resources.tsx` | Adicionar Tabs com Solicitacoes + Inventario |

### Ordem de execucao
1. Migration para `material_inventory`
2. Criar `AdminHierarchy.tsx` e integrar em Admin
3. Criar `MaterialInventory.tsx` e integrar em Resources


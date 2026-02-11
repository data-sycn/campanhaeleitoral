

## Reestruturar Navegacao: Dashboard como Hub Central

O objetivo e remover o `ModuleSwitcher` do topo de todas as paginas de modulo e transformar o Dashboard (`/dashboard`) no hub central de navegacao, onde o usuario ve os dados resumidos E pode trocar de modulo atraves de blocos visuais.

---

### O que muda

1. **Remover `ModuleSwitcher` de todas as paginas de modulo** (9 arquivos):
   - `Budget.tsx`, `Expenses.tsx`, `Supporters.tsx`, `Reports.tsx`, `Resources.tsx`, `StreetCheckin.tsx`, `DossieVisita.tsx`, `Admin.tsx`, `Dashboard.tsx`
   - Cada pagina perde o bloco `<div className="mb-6"><ModuleSwitcher /></div>` do topo

2. **Transformar o Dashboard em Hub com blocos de modulo**:
   - Na pagina `/dashboard`, abaixo do cabecalho, adicionar uma grade de cards clicaveis representando cada modulo (Financeiro, Apoiadores, Check-in, Recursos, Relatorios, Admin)
   - Cada card tera: icone, nome do modulo e um mini-indicador de status/contagem
   - Ao clicar, navega diretamente para a pagina do modulo
   - Os KPIs e widgets do dashboard continuam abaixo dos blocos

3. **Navegacao de retorno**: Nas paginas de modulo, o usuario usa a Navbar (que ja tem os links) ou um botao "Voltar ao Dashboard" para retornar ao hub

### Detalhes Tecnicos

**Arquivos a editar:**

| Arquivo | Acao |
|---------|------|
| `src/pages/Dashboard.tsx` | Substituir `ModuleSwitcher` por grade de cards/blocos de modulo com navegacao |
| `src/pages/Budget.tsx` | Remover import e uso do `ModuleSwitcher` |
| `src/pages/Expenses.tsx` | Remover import e uso do `ModuleSwitcher` |
| `src/pages/Supporters.tsx` | Remover import e uso do `ModuleSwitcher` |
| `src/pages/Reports.tsx` | Remover import e uso do `ModuleSwitcher` |
| `src/pages/Resources.tsx` | Remover import e uso do `ModuleSwitcher` |
| `src/pages/StreetCheckin.tsx` | Remover import e uso do `ModuleSwitcher` |
| `src/pages/DossieVisita.tsx` | Remover import e uso do `ModuleSwitcher` |
| `src/pages/Admin.tsx` | Remover import e uso do `ModuleSwitcher` |

**Dashboard - Grade de Modulos:**
- Layout: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4` com cards clicaveis
- Cada bloco: icone grande, titulo, mini-stat (ex: "R$ 50.000" no Financeiro, "42" em Apoiadores)
- Modulo ativo destacado visualmente
- Agrupamento: "Financeiro" unifica Orcamento + Despesas

**Paginas de modulo:**
- Sem `ModuleSwitcher` no topo
- Navbar continua com links de navegacao entre modulos
- Opcao de adicionar um botao discreto "← Dashboard" no cabecalho de cada modulo


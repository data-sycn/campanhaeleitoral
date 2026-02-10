# Diagrama do Banco de Dados - CampanhaGov

## Tabelas Principais

### `campanhas` (Nova)
- **id** (UUID, PK): Identificador único da campanha
- **nome** (TEXT): Nome da campanha/candidato
- **numero_candidato** (TEXT): Número do candidato
- **partido** (TEXT): Sigla do partido
- **cargo** (TEXT): Cargo pleiteado
- **uf** (CHAR(2)): Unidade Federativa
- **municipio** (TEXT): Município
- **logo_url** (TEXT): URL do logo
- **cor_primaria** (TEXT): Cor temática (#HEX)
- **created_at** (TIMESTAMPTZ)
- **updated_at** (TIMESTAMPTZ)
- **deleted_at** (TIMESTAMPTZ)

### `profiles` (Modificada)
- **id** (UUID, PK, FK: auth.users)
- **name** (TEXT)
- **candidate_id** (UUID, FK: candidates) ← Mantida para compatibilidade
- **parent_id** (UUID, FK: profiles) ← **NOVO**: Hierarquia de liderança
- **campanha_id** (UUID, FK: campanhas) ← **NOVO**: Vinculação multi-tenant
- **created_at** (TIMESTAMPTZ)
- **updated_at** (TIMESTAMPTZ)

### `user_roles` (Existente)
- **user_id** (UUID, FK: auth.users)
- **role** (app_role ENUM: 'master', 'admin', 'user')

### Tabelas com `campanha_id` (Modificadas)
Todas as tabelas abaixo receberam a FK `campanha_id` (UUID) referenciando `campanhas(id)`:

- `budgets`
- `expenses` 
- `supporters`
- `reports`

### `supporters` (Nova)
- **id** (UUID, PK)
- **campanha_id** (UUID, FK: campanhas)
- **nome** (TEXT)
- **email** (TEXT)
- **telefone** (TEXT)
- **cpf** (TEXT)
- **endereco** (TEXT)
- **bairro** (TEXT)
- **cidade** (TEXT)
- **estado** (CHAR(2))
- **cep** (TEXT)
- **geolocation** (geography(Point, 4326)) ← **NOVO**: Dados espaciais
- **latitude** (DOUBLE PRECISION) ← **NOVO**: Coordenada Y
- **longitude** (DOUBLE PRECISION) ← **NOVO**: Coordenada X
- **created_at** (TIMESTAMPTZ)
- **updated_at** (TIMESTAMPTZ)

### `reports` (Nova)
- **id** (UUID, PK)
- **campanha_id** (UUID, FK: campanhas)
- **title** (TEXT)
- **description** (TEXT)
- **file_url** (TEXT)
- **report_type** (TEXT)
- **generated_at** (TIMESTAMPTZ)
- **created_at** (TIMESTAMPTZ)
- **updated_at** (TIMESTAMPTZ)

## Relacionamentos

```
campanhas (1) ──────── (∞) profiles
campanhas (1) ──────── (∞) budgets
campanhas (1) ──────── (∞) expenses  
campanhas (1) ──────── (∞) supporters
campanhas (1) ──────── (∞) reports

profiles (1) ──────── (∞) profiles (via parent_id) [Hierarquia]
```

## Políticas de Segurança (RLS)

### Para Usuário Master:
- ✅ Acesso COMPLETO a todos os dados de TODAS as campanhas

### Para Admin/Usuário Comum:
- 🔐 Acesso RESTRITO apenas aos dados da `campanha_id` vinculada ao seu perfil
- 👥 Podem gerenciar apenas os recursos da sua própria campanha

## Views Úteis

### `supporters_heatmap`
View para geração de mapas de calor geográficos dos apoiadores.

## Índices de Performance
- `supporters_geolocation_idx` (GIST): Índice espacial para consultas geográficas rápidas

## Extensões
- **PostGIS**: Habilitada para inteligência geográfica e spatial queries
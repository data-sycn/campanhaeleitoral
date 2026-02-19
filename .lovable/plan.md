

# Fase 4 — Itens Pendentes da Especificacao

Comparacao detalhada do PDF com o sistema atual revelou 5 funcionalidades ainda nao implementadas.

---

## 1. Relatorios de Produtividade por Equipe/Operador

O PDF exige: "Quem fez o que, onde e para quem" e "Ranking de Efetividade comparando equipes e municipios".

Atualmente `Reports.tsx` so mostra gastos por categoria. Falta:

- Tabela de produtividade: check-ins por operador, ruas concluidas, feedbacks coletados
- Ranking de equipes por cidade (ruas visitadas vs. investimento)

**Arquivos**: Editar `src/pages/Reports.tsx` para adicionar aba/secao de produtividade usando dados de `street_checkins` + `profiles`.

---

## 2. Exportacao PDF Funcional

O botao "Exportar PDF" em Reports.tsx e um stub. Implementar geracao real usando `window.print()` com CSS `@media print` otimizado, que e a abordagem mais leve sem dependencias extras.

**Arquivos**: Editar `src/pages/Reports.tsx`.

---

## 3. Importacao de Dados de Votacao (CSV)

O PDF menciona "importar dados de votacao" para cruzar com esforco de campo no modulo ROI. As tabelas `votes_raw` e `votes_agg` existem mas nao ha UI para popular.

- Criar pagina/dialog para upload de CSV com colunas: zona, secao, votos
- Validar estrutura do CSV, deduplicar por zona+secao
- Inserir em `votes_raw` e recalcular `votes_agg`

**Arquivos**: Criar `src/components/roi/VotesImport.tsx`, editar `src/pages/ROI.tsx` para incluir botao de importacao. Instalar `papaparse` (ja disponivel no stack conforme memoria).

---

## 4. Suporte a Fotos no Check-in

O PDF diz: "registre tudo (ruas, feedbacks, fotos) offline". Atualmente nao ha captura de foto.

- Criar bucket `checkin-photos` no Supabase Storage
- Adicionar campo opcional de foto no formulario de check-in (captura via camera ou galeria)
- Upload ao Supabase Storage, salvar URL no check-in
- Requer nova coluna `photo_url TEXT` na tabela `street_checkins`

**Arquivos**: Migration SQL (nova coluna + bucket + RLS), editar `src/pages/StreetCheckin.tsx`.

---

## 5. Auto-cadastro via Link de Convite

O PDF menciona: "cadastrar os colaboradores via aplicativo (atraves de links ou cadastro direto)".

- Gerar link de convite com token unico vinculado a campanha
- Pagina publica `/convite/:token` para novo usuario se registrar ja vinculado a campanha correta
- Nova tabela `invite_links` (token, campanha_id, created_by, expires_at, used_at)

**Arquivos**: Migration SQL, criar `src/pages/Invite.tsx`, editar `src/App.tsx`.

---

## Detalhes Tecnicos

### Banco de Dados (Migrations)

1. **Coluna photo_url em street_checkins**:
```text
ALTER TABLE street_checkins ADD COLUMN photo_url TEXT;
```

2. **Bucket checkin-photos**:
```text
INSERT INTO storage.buckets (id, name, public) VALUES ('checkin-photos', 'checkin-photos', true);
-- RLS: authenticated users can upload, anyone can read
```

3. **Tabela invite_links**:
```text
CREATE TABLE invite_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id UUID NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL,
  expires_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: coordinators/admins da campanha podem criar e visualizar
```

### Arquivos Criados
| Arquivo | Descricao |
|---|---|
| `src/components/roi/VotesImport.tsx` | Dialog de importacao CSV de votos |
| `src/pages/Invite.tsx` | Pagina publica de auto-cadastro |
| Migration SQL | photo_url + bucket + invite_links |

### Arquivos Editados
| Arquivo | Mudanca |
|---|---|
| `src/pages/Reports.tsx` | Adicionar secao de produtividade por operador + print PDF |
| `src/pages/ROI.tsx` | Botao para abrir VotesImport |
| `src/pages/StreetCheckin.tsx` | Campo de foto com upload |
| `src/App.tsx` | Rota `/convite/:token` |

### Ordem de Execucao
1. Migrations (photo_url, bucket, invite_links)
2. Reports.tsx (produtividade + PDF)
3. VotesImport + integracao no ROI
4. Foto no StreetCheckin
5. Invite (link de convite + pagina)


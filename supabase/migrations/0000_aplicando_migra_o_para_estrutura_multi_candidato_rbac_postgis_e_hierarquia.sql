-- =============================================
-- MIGRAÇÃO 001: Estrutura Multi-Candidato + RBAC + PostGIS + Hierarquia
-- Para o Sistema CampanhaGov
-- =============================================

-- 1. HABILITAR EXTENSÃO POSTGIS (Inteligência Geográfica)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. CRIAR TABELA DE CAMPANHAS (Unidades de Controle)
CREATE TABLE IF NOT EXISTS campanhas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    numero_candidato TEXT,
    partido TEXT,
    cargo TEXT,
    uf CHAR(2),
    municipio TEXT,
    logo_url TEXT,
    cor_primaria TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE campanhas IS 'Tabela principal de campanhas/Unidades de Controle do sistema';

-- 3. ADICIONAR CAMPANHA_ID NAS TABELAS EXISTENTES
-- Budgets
ALTER TABLE budgets 
ADD COLUMN IF NOT EXISTS campanha_id UUID REFERENCES campanhas(id) ON DELETE CASCADE;

-- Expenses
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS campanha_id UUID REFERENCES campanhas(id) ON DELETE CASCADE;

-- Supporters (precisamos criar esta tabela primeiro)
CREATE TABLE IF NOT EXISTS supporters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campanha_id UUID REFERENCES campanhas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    cpf TEXT,
    endereco TEXT,
    bairro TEXT,
    cidade TEXT,
    estado CHAR(2),
    cep TEXT,
    geolocation geography(Point, 4326),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports (também precisamos criar esta tabela)
CREATE TABLE IF NOT EXISTS reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campanha_id UUID REFERENCES campanhas(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    report_type TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ADICIONAR HIERARQUIA NA TABELA PROFILES
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS campanha_id UUID REFERENCES campanhas(id);

-- 5. ATUALIZAR POLÍTICAS RLS PARA ESTRUTURA MULTI-CANDIDATO

-- Política para Master: Acesso a TUDO
CREATE POLICY "Master access all campanhas" ON campanhas
FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'master'
));

CREATE POLICY "Master access all budgets" ON budgets
FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'master'
));

CREATE POLICY "Master access all expenses" ON expenses
FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'master'
));

CREATE POLICY "Master access all supporters" ON supporters
FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'master'
));

CREATE POLICY "Master access all reports" ON reports
FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'master'
));

-- Políticas para Admin/Usuário: Acesso apenas à campanha vinculada
CREATE POLICY "Users access own campanha data" ON campanhas
FOR SELECT USING (
    id IN (SELECT campanha_id FROM profiles WHERE id = auth.uid())
    OR auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'master')
);

CREATE POLICY "Users access own campanha budgets" ON budgets
FOR ALL USING (
    campanha_id IN (SELECT campanha_id FROM profiles WHERE id = auth.uid())
    OR auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'master')
);

CREATE POLICY "Users access own campanha expenses" ON expenses
FOR ALL USING (
    campanha_id IN (SELECT campanha_id FROM profiles WHERE id = auth.uid())
    OR auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'master')
);

CREATE POLICY "Users access own campanha supporters" ON supporters
FOR ALL USING (
    campanha_id IN (SELECT campanha_id FROM profiles WHERE id = auth.uid())
    OR auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'master')
);

CREATE POLICY "Users access own campanha reports" ON reports
FOR ALL USING (
    campanha_id IN (SELECT campanha_id FROM profiles WHERE id = auth.uid())
    OR auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'master')
);

-- 6. FUNÇÃO PARA ATUALIZAR GEOLOCATION
CREATE OR REPLACE FUNCTION update_supporter_geolocation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.geolocation = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    ELSE
        NEW.geolocation = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. TRIGGER PARA GEOLOCATION
DROP TRIGGER IF EXISTS update_supporter_geolocation_trigger ON supporters;
CREATE TRIGGER update_supporter_geolocation_trigger
    BEFORE INSERT OR UPDATE OF latitude, longitude ON supporters
    FOR EACH ROW
    EXECUTE FUNCTION update_supporter_geolocation();

-- 8. ÍNDICE ESPACIAL PARA PERFORMANCE DE CONSULTAS GEOGRÁFICAS
CREATE INDEX IF NOT EXISTS supporters_geolocation_idx 
ON supporters USING GIST (geolocation);

-- 9. VIEW PARA MAPA DE CALOR DE APOIADORES
CREATE OR REPLACE VIEW supporters_heatmap AS
SELECT 
    s.id,
    s.nome,
    s.geolocation,
    s.latitude,
    s.longitude,
    s.bairro,
    s.cidade,
    s.estado,
    c.nome as campanha_nome,
    c.partido as campanha_partido
FROM supporters s
LEFT JOIN campanhas c ON s.campanha_id = c.id
WHERE s.geolocation IS NOT NULL;

-- 10. ATUALIZAR TIMESTAMP NAS TABELAS MODIFICADAS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger updated_at nas tabelas modificadas
DROP TRIGGER IF EXISTS update_campanhas_updated_at ON campanhas;
CREATE TRIGGER update_campanhas_updated_at
    BEFORE UPDATE ON campanhas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FIM DA MIGRAÇÃO
-- =============================================
-- =============================================
-- MIGRAÇÃO 002: Seed Data - Campanha Master e Vinculação
-- =============================================

-- 1. CRIAR CAMPANHA MASTER/PADRÃO PARA O SISTEMA
INSERT INTO campanhas (id, nome, partido, cargo, uf, municipio, cor_primaria)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Sistema CampanhaGov',
    'SISTEMA',
    'Plataforma',
    'BR',
    'Brasil',
    '#6366F1'
) ON CONFLICT (id) DO NOTHING;

-- 2. VINCULAR USUÁRIO MASTER À CAMPANHA DO SISTEMA
-- Primeiro, vamos encontrar o usuário master
DO $$
DECLARE
    master_user_id UUID;
BEGIN
    SELECT user_id INTO master_user_id FROM user_roles WHERE role = 'master' LIMIT 1;
    
    IF master_user_id IS NOT NULL THEN
        -- Atualizar perfil do master
        UPDATE profiles 
        SET campanha_id = '00000000-0000-0000-0000-000000000001'
        WHERE id = master_user_id;
    END IF;
END $$;

-- 3. ATUALIZAR DADOS EXISTENTES PARA VINCULAR À CAMPANHA
-- Budgets existentes
UPDATE budgets 
SET campanha_id = '00000000-0000-0000-0000-000000000001'
WHERE campanha_id IS NULL;

-- Expenses existentes
UPDATE expenses 
SET campanha_id = '00000000-0000-0000-0000-000000000001'
WHERE campanha_id IS NULL;

-- =============================================
-- FIM DA MIGRAÇÃO
-- =============================================
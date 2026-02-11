
-- =====================================================
-- 1. Tabela de ruas (base única para check-in)
-- =====================================================
CREATE TABLE public.streets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id uuid NOT NULL REFERENCES public.campanhas(id) ON DELETE CASCADE,
  nome text NOT NULL,
  bairro text,
  cidade text,
  estado char(2),
  cep text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(campanha_id, nome, bairro, cidade)
);

ALTER TABLE public.streets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master access all streets" ON public.streets
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'master'));

CREATE POLICY "Users access own campanha streets" ON public.streets
  FOR ALL USING (
    campanha_id IN (SELECT campanha_id FROM profiles WHERE id = auth.uid())
    OR auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'master')
  );

-- =====================================================
-- 2. Tabela de check-ins de rua
-- =====================================================
CREATE TABLE public.street_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  street_id uuid NOT NULL REFERENCES public.streets(id) ON DELETE CASCADE,
  campanha_id uuid NOT NULL REFERENCES public.campanhas(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  notes text,
  geolocation geometry(Point, 4326),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.street_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master access all checkins" ON public.street_checkins
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'master'));

CREATE POLICY "Users access own campanha checkins" ON public.street_checkins
  FOR ALL USING (
    campanha_id IN (SELECT campanha_id FROM profiles WHERE id = auth.uid())
    OR auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'master')
  );

-- Índice para verificar check-ins ativos por rua
CREATE INDEX idx_street_checkins_active ON public.street_checkins(street_id, status) WHERE status = 'active';

-- =====================================================
-- 3. Tabela de solicitações de recursos
-- =====================================================
CREATE TABLE public.resource_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id uuid NOT NULL REFERENCES public.campanhas(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('combustivel', 'material', 'alimentacao', 'outros')),
  descricao text NOT NULL,
  quantidade numeric NOT NULL DEFAULT 1,
  valor_estimado numeric NOT NULL DEFAULT 0,
  localidade text NOT NULL,
  bairro text,
  cidade text,
  status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'recusado', 'entregue')),
  aprovado_por uuid,
  aprovado_em timestamptz,
  expense_id uuid REFERENCES public.expenses(id),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.resource_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master access all resource_requests" ON public.resource_requests
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'master'));

CREATE POLICY "Users access own campanha resource_requests" ON public.resource_requests
  FOR ALL USING (
    campanha_id IN (SELECT campanha_id FROM profiles WHERE id = auth.uid())
    OR auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'master')
  );

-- =====================================================
-- 4. Trigger para updated_at nas novas tabelas
-- =====================================================
CREATE TRIGGER update_street_checkins_updated_at
  BEFORE UPDATE ON public.street_checkins
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resource_requests_updated_at
  BEFORE UPDATE ON public.resource_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

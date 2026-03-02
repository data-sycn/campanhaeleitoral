
CREATE TABLE public.municipios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id uuid NOT NULL REFERENCES public.campanhas(id) ON DELETE CASCADE,
  nome text NOT NULL,
  estado char(2) NOT NULL,
  populacao integer NULL,
  zona_eleitoral text NULL,
  meta_votos integer NULL,
  coordenador_id uuid NULL,
  status text NOT NULL DEFAULT 'ativo',
  notes text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(campanha_id, nome, estado)
);

ALTER TABLE public.municipios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master access all municipios"
ON public.municipios FOR ALL TO authenticated
USING (is_master(auth.uid()))
WITH CHECK (is_master(auth.uid()));

CREATE POLICY "Users access own campanha municipios"
ON public.municipios FOR ALL TO authenticated
USING (
  campanha_id IN (SELECT profiles.campanha_id FROM profiles WHERE profiles.id = auth.uid())
  OR is_master(auth.uid())
)
WITH CHECK (
  campanha_id IN (SELECT profiles.campanha_id FROM profiles WHERE profiles.id = auth.uid())
  OR is_master(auth.uid())
);


-- Add prioridade column to municipios
ALTER TABLE public.municipios ADD COLUMN IF NOT EXISTS prioridade text NOT NULL DEFAULT 'media';

-- Create voting history table for municipios
CREATE TABLE public.municipio_historico_votacao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  municipio_id uuid NOT NULL REFERENCES public.municipios(id) ON DELETE CASCADE,
  campanha_id uuid NOT NULL REFERENCES public.campanhas(id) ON DELETE CASCADE,
  eleicao_ano integer NOT NULL,
  cargo text NOT NULL,
  votacao integer NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.municipio_historico_votacao ENABLE ROW LEVEL SECURITY;

-- RLS policies matching municipios pattern
CREATE POLICY "Master access all municipio_historico_votacao"
  ON public.municipio_historico_votacao FOR ALL
  USING (is_master(auth.uid()))
  WITH CHECK (is_master(auth.uid()));

CREATE POLICY "Users access own campanha municipio_historico_votacao"
  ON public.municipio_historico_votacao FOR ALL
  USING (
    (campanha_id IN (SELECT p.campanha_id FROM profiles p WHERE p.id = auth.uid()))
    OR is_master(auth.uid())
  )
  WITH CHECK (
    (campanha_id IN (SELECT p.campanha_id FROM profiles p WHERE p.id = auth.uid()))
    OR is_master(auth.uid())
  );

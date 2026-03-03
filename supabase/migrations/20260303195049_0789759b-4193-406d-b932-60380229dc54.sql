
-- Tabela de eventos da agenda de campanha
CREATE TABLE public.agenda_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id uuid NOT NULL REFERENCES public.campanhas(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descricao text,
  tipo text NOT NULL DEFAULT 'reuniao',
  data_inicio timestamptz NOT NULL,
  data_fim timestamptz,
  local text,
  cidade text,
  bairro text,
  responsavel_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  participantes uuid[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'confirmado',
  prioridade text NOT NULL DEFAULT 'normal',
  recorrente boolean NOT NULL DEFAULT false,
  notas text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.agenda_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master access all agenda_events"
ON public.agenda_events FOR ALL
USING (is_master(auth.uid()))
WITH CHECK (is_master(auth.uid()));

CREATE POLICY "Users access own campanha agenda_events"
ON public.agenda_events FOR ALL
USING (
  campanha_id IN (SELECT p.campanha_id FROM profiles p WHERE p.id = auth.uid())
  OR is_master(auth.uid())
)
WITH CHECK (
  campanha_id IN (SELECT p.campanha_id FROM profiles p WHERE p.id = auth.uid())
  OR is_master(auth.uid())
);

-- Index for fast date-based queries
CREATE INDEX idx_agenda_events_data ON public.agenda_events (campanha_id, data_inicio);

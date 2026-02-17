
-- Create team_messages table for direct communication
CREATE TABLE public.team_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campanha_id UUID NOT NULL REFERENCES public.campanhas(id),
  sender_id UUID NOT NULL,
  cidade TEXT,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  prioridade TEXT NOT NULL DEFAULT 'normal',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_messages ENABLE ROW LEVEL SECURITY;

-- Master access all
CREATE POLICY "Master access all team_messages"
ON public.team_messages FOR ALL TO authenticated
USING (is_master(auth.uid()));

-- Users can read messages from their campaign
CREATE POLICY "Users read own campanha messages"
ON public.team_messages FOR SELECT TO authenticated
USING (
  campanha_id IN (SELECT profiles.campanha_id FROM profiles WHERE profiles.id = auth.uid())
  OR is_master(auth.uid())
);

-- Coordinators/admins can insert messages
CREATE POLICY "Coordinators can send messages"
ON public.team_messages FOR INSERT TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND (
    has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'coordinator') OR is_master(auth.uid())
  )
  AND (
    campanha_id IN (SELECT profiles.campanha_id FROM profiles WHERE profiles.id = auth.uid())
    OR is_master(auth.uid())
  )
);

-- Indexes
CREATE INDEX idx_team_messages_campanha ON public.team_messages(campanha_id);
CREATE INDEX idx_team_messages_created ON public.team_messages(created_at DESC);

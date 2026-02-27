
-- Create revenues table
CREATE TABLE public.revenues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campanha_id UUID REFERENCES public.campanhas(id),
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  source TEXT NOT NULL DEFAULT 'doacao',
  donor_name TEXT,
  donor_cpf_cnpj TEXT,
  receipt_url TEXT,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.revenues ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Master access all revenues" ON public.revenues FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'master'::app_role));

CREATE POLICY "Users access own campanha revenues" ON public.revenues FOR ALL
  USING (
    (campanha_id IN (SELECT campanha_id FROM profiles WHERE id = auth.uid()))
    OR (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'master'::app_role))
  );


-- Tabela de dispositivos confiáveis
CREATE TABLE public.trusted_devices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  device_token text NOT NULL UNIQUE,
  device_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_used_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.trusted_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own devices"
  ON public.trusted_devices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own devices"
  ON public.trusted_devices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own devices"
  ON public.trusted_devices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own devices"
  ON public.trusted_devices FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Master can manage all devices"
  ON public.trusted_devices FOR ALL
  USING (is_master(auth.uid()));

-- RPC para validar PIN do usuário autenticado
CREATE OR REPLACE FUNCTION public.validate_pin(p_pin text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND pin = p_pin
  );
$$;


-- 1. Add 'supervisor' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'supervisor';

-- 2. Create junction table for users with multiple campaigns (admin role)
CREATE TABLE public.user_campanhas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campanha_id uuid NOT NULL REFERENCES public.campanhas(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, campanha_id)
);

ALTER TABLE public.user_campanhas ENABLE ROW LEVEL SECURITY;

-- Master can manage all
CREATE POLICY "Master access all user_campanhas"
ON public.user_campanhas FOR ALL
USING (is_master(auth.uid()));

-- Admins can view their own associations
CREATE POLICY "Users can view own campanhas"
ON public.user_campanhas FOR SELECT
USING (auth.uid() = user_id);

-- Admins can manage associations (only master/admin can insert)
CREATE POLICY "Admins can manage user_campanhas"
ON public.user_campanhas FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

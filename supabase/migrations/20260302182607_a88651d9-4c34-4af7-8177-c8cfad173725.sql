
-- Remove existing ALL policy for master (we'll recreate split policies)
DROP POLICY IF EXISTS "Master access all campanhas" ON public.campanhas;
DROP POLICY IF EXISTS "Users access own campanha data" ON public.campanhas;

-- Master can do everything (permissive)
CREATE POLICY "Master full access campanhas"
ON public.campanhas
FOR ALL
TO authenticated
USING (is_master(auth.uid()))
WITH CHECK (is_master(auth.uid()));

-- Users can SELECT their own campanha (permissive)
CREATE POLICY "Users can view own campanha"
ON public.campanhas
FOR SELECT
TO authenticated
USING (
  id IN (SELECT profiles.campanha_id FROM profiles WHERE profiles.id = auth.uid())
  OR is_master(auth.uid())
);

-- Admins can view campanhas they manage via user_campanhas
CREATE POLICY "Admins can view managed campanhas"
ON public.campanhas
FOR SELECT
TO authenticated
USING (
  id IN (SELECT uc.campanha_id FROM user_campanhas uc WHERE uc.user_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
);

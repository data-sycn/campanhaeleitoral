CREATE POLICY "Admins can update profiles in their campaign"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  AND (
    campanha_id IN (SELECT uc.campanha_id FROM user_campanhas uc WHERE uc.user_id = auth.uid())
    OR campanha_id IN (SELECT p.campanha_id FROM profiles p WHERE p.id = auth.uid())
    OR campanha_id IS NULL
  )
)
WITH CHECK (true);
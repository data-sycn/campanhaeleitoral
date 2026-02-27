
CREATE POLICY "Master can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (is_master(auth.uid()))
WITH CHECK (is_master(auth.uid()));

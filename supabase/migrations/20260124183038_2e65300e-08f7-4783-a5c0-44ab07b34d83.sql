-- Fix audit_log insert policy to be more restrictive
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_log;

-- Only authenticated users can insert audit logs (for their own actions)
CREATE POLICY "Authenticated users can insert audit logs" ON public.audit_log 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
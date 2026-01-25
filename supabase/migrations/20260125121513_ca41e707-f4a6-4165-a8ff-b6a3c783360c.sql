-- Update nailton.alsampaio@gmail.com from 'admin' to 'master'
UPDATE public.user_roles 
SET role = 'master' 
WHERE user_id = '82e84278-b4b2-48fb-a02b-3b533d8adfb8' 
AND role = 'admin';

-- Create is_master helper function for RLS policies
CREATE OR REPLACE FUNCTION public.is_master(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'master'
  )
$$;
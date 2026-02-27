-- Allow anon users to look up profiles by PIN (only returns id, no sensitive data)
CREATE OR REPLACE FUNCTION public.get_user_id_by_pin(p_pin text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE pin = p_pin LIMIT 1;
$$;
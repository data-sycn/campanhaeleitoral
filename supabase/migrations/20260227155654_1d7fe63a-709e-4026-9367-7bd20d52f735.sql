-- Add email column to profiles for PIN lookup
ALTER TABLE public.profiles ADD COLUMN email text;

-- Update function to return email by PIN
CREATE OR REPLACE FUNCTION public.get_email_by_pin(p_pin text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM public.profiles WHERE pin = p_pin LIMIT 1;
$$;

-- Drop old function
DROP FUNCTION IF EXISTS public.get_user_id_by_pin(text);
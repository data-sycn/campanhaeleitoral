-- Allow master users to view all profiles
CREATE POLICY "Master can view all profiles"
ON public.profiles
FOR SELECT
USING (is_master(auth.uid()));

-- Allow master users to update all profiles (for campanha assignment)
CREATE POLICY "Master can update all profiles"
ON public.profiles
FOR UPDATE
USING (is_master(auth.uid()));

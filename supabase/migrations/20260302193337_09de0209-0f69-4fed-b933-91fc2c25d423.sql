ALTER TABLE public.profiles ADD COLUMN supporter_id uuid REFERENCES public.supporters(id) ON DELETE SET NULL;

CREATE INDEX idx_profiles_supporter_id ON public.profiles(supporter_id);
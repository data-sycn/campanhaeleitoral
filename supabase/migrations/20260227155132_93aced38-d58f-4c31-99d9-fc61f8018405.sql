ALTER TABLE public.profiles ADD COLUMN pin text UNIQUE;
CREATE INDEX idx_profiles_pin ON public.profiles(pin);
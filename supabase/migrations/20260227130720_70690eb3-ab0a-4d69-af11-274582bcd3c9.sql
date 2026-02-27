
ALTER TABLE public.budgets ADD COLUMN title TEXT;
ALTER TABLE public.budgets ALTER COLUMN year DROP NOT NULL;
ALTER TABLE public.budgets ALTER COLUMN year SET DEFAULT EXTRACT(YEAR FROM now())::integer;

-- Create enums
CREATE TYPE public.app_role AS ENUM ('admin', 'candidate', 'supporter');
CREATE TYPE public.expense_category AS ENUM ('publicidade', 'transporte', 'alimentacao', 'material', 'eventos', 'pessoal', 'outros');
CREATE TYPE public.payment_method AS ENUM ('pix', 'cartao', 'dinheiro', 'transferencia', 'boleto');

-- Create candidates table
CREATE TABLE public.candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    party TEXT,
    position TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    candidate_id UUID REFERENCES public.candidates(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Create budgets table
CREATE TABLE public.budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    total_planned NUMERIC(12,2) NOT NULL DEFAULT 0,
    notes TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (candidate_id, year)
);

-- Create expenses table
CREATE TABLE public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    category public.expense_category NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    payment_method public.payment_method NOT NULL,
    receipt_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create votes_raw table
CREATE TABLE public.votes_raw (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    zone TEXT,
    section TEXT,
    votes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create votes_agg table
CREATE TABLE public.votes_agg (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    total_votes INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create audit_log table
CREATE TABLE public.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes_raw ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes_agg ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    )
$$;

-- Function to get user's candidate_id
CREATE OR REPLACE FUNCTION public.get_user_candidate_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT candidate_id FROM public.profiles WHERE id = _user_id
$$;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
    
    -- Assign default 'supporter' role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'supporter');
    
    RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Timestamp triggers
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON public.candidates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles (only admins can manage roles)
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for candidates
CREATE POLICY "Users can view their candidate" ON public.candidates FOR SELECT USING (
    id = public.get_user_candidate_id(auth.uid()) OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Admins can manage candidates" ON public.candidates FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for budgets
CREATE POLICY "Users can view budgets for their candidate" ON public.budgets FOR SELECT USING (
    candidate_id = public.get_user_candidate_id(auth.uid()) OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Users can insert budgets for their candidate" ON public.budgets FOR INSERT WITH CHECK (
    candidate_id = public.get_user_candidate_id(auth.uid()) OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Users can update budgets for their candidate" ON public.budgets FOR UPDATE USING (
    candidate_id = public.get_user_candidate_id(auth.uid()) OR public.has_role(auth.uid(), 'admin')
);

-- RLS Policies for expenses
CREATE POLICY "Users can view expenses for their candidate" ON public.expenses FOR SELECT USING (
    candidate_id = public.get_user_candidate_id(auth.uid()) OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Users can insert expenses for their candidate" ON public.expenses FOR INSERT WITH CHECK (
    candidate_id = public.get_user_candidate_id(auth.uid()) OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Users can update expenses for their candidate" ON public.expenses FOR UPDATE USING (
    candidate_id = public.get_user_candidate_id(auth.uid()) OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Users can delete expenses for their candidate" ON public.expenses FOR DELETE USING (
    candidate_id = public.get_user_candidate_id(auth.uid()) OR public.has_role(auth.uid(), 'admin')
);

-- RLS Policies for votes_raw
CREATE POLICY "Users can view votes for their candidate" ON public.votes_raw FOR SELECT USING (
    candidate_id = public.get_user_candidate_id(auth.uid()) OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Users can insert votes for their candidate" ON public.votes_raw FOR INSERT WITH CHECK (
    candidate_id = public.get_user_candidate_id(auth.uid()) OR public.has_role(auth.uid(), 'admin')
);

-- RLS Policies for votes_agg
CREATE POLICY "Users can view aggregated votes for their candidate" ON public.votes_agg FOR SELECT USING (
    candidate_id = public.get_user_candidate_id(auth.uid()) OR public.has_role(auth.uid(), 'admin')
);

-- RLS Policies for audit_log
CREATE POLICY "Users can view own audit logs" ON public.audit_log FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all audit logs" ON public.audit_log FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert audit logs" ON public.audit_log FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_profiles_candidate_id ON public.profiles(candidate_id);
CREATE INDEX idx_budgets_candidate_id ON public.budgets(candidate_id);
CREATE INDEX idx_expenses_candidate_id ON public.expenses(candidate_id);
CREATE INDEX idx_expenses_date ON public.expenses(date);
CREATE INDEX idx_expenses_category ON public.expenses(category);
CREATE INDEX idx_votes_raw_candidate_id ON public.votes_raw(candidate_id);
CREATE INDEX idx_votes_agg_candidate_id ON public.votes_agg(candidate_id);
CREATE INDEX idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
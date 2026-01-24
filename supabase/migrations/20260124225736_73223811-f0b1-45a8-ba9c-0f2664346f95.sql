-- Create budget_allocations table to distribute budget across expense categories
CREATE TABLE public.budget_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
    category public.expense_category NOT NULL,
    planned_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (budget_id, category)
);

-- Enable RLS
ALTER TABLE public.budget_allocations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (access based on parent budget's candidate_id)
CREATE POLICY "Users can view allocations for their candidate budgets"
ON public.budget_allocations FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.budgets b
        WHERE b.id = budget_id
        AND (b.candidate_id = get_user_candidate_id(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role))
    )
);

CREATE POLICY "Users can insert allocations for their candidate budgets"
ON public.budget_allocations FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.budgets b
        WHERE b.id = budget_id
        AND (b.candidate_id = get_user_candidate_id(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role))
    )
);

CREATE POLICY "Users can update allocations for their candidate budgets"
ON public.budget_allocations FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.budgets b
        WHERE b.id = budget_id
        AND (b.candidate_id = get_user_candidate_id(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role))
    )
);

CREATE POLICY "Users can delete allocations for their candidate budgets"
ON public.budget_allocations FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.budgets b
        WHERE b.id = budget_id
        AND (b.candidate_id = get_user_candidate_id(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role))
    )
);

-- Create indexes for performance
CREATE INDEX idx_budget_allocations_budget_id ON public.budget_allocations(budget_id);

-- Create trigger for updated_at
CREATE TRIGGER update_budget_allocations_updated_at
    BEFORE UPDATE ON public.budget_allocations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
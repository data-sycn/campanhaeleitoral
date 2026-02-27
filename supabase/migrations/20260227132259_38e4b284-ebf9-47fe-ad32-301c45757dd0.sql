
-- Drop old restrictive policies on budget_allocations
DROP POLICY IF EXISTS "Users can insert allocations for their candidate budgets" ON public.budget_allocations;
DROP POLICY IF EXISTS "Users can update allocations for their candidate budgets" ON public.budget_allocations;
DROP POLICY IF EXISTS "Users can view allocations for their candidate budgets" ON public.budget_allocations;
DROP POLICY IF EXISTS "Users can delete allocations for their candidate budgets" ON public.budget_allocations;

-- Create new policies based on campanha_id (through budgets join)
CREATE POLICY "Users access own campanha allocations" ON public.budget_allocations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM budgets b
      WHERE b.id = budget_allocations.budget_id
      AND (
        b.campanha_id IN (SELECT campanha_id FROM profiles WHERE id = auth.uid())
        OR auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'master'::app_role)
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM budgets b
      WHERE b.id = budget_allocations.budget_id
      AND (
        b.campanha_id IN (SELECT campanha_id FROM profiles WHERE id = auth.uid())
        OR auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'master'::app_role)
      )
    )
  );

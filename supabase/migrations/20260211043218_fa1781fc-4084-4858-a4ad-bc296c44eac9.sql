
-- Create route_assignments table for route planning
CREATE TABLE public.route_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campanha_id UUID NOT NULL REFERENCES public.campanhas(id),
  assigned_by UUID NOT NULL,
  assigned_to UUID NOT NULL,
  street_id UUID NOT NULL REFERENCES public.streets(id),
  data_planejada DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.route_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Master access all route_assignments"
  ON public.route_assignments FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'master'::app_role));

CREATE POLICY "Users access own campanha route_assignments"
  ON public.route_assignments FOR ALL
  USING (
    campanha_id IN (SELECT campanha_id FROM profiles WHERE id = auth.uid())
    OR auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'master'::app_role)
  );

-- Trigger for updated_at
CREATE TRIGGER update_route_assignments_updated_at
  BEFORE UPDATE ON public.route_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

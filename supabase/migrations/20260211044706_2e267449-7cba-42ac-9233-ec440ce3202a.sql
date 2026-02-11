
CREATE TABLE public.material_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campanha_id UUID NOT NULL REFERENCES public.campanhas(id),
  tipo TEXT NOT NULL,
  descricao TEXT,
  cidade TEXT NOT NULL,
  quantidade_enviada INTEGER NOT NULL DEFAULT 0,
  quantidade_reportada INTEGER NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.material_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master access all material_inventory"
ON public.material_inventory FOR ALL
USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'master'::app_role));

CREATE POLICY "Users access own campanha material_inventory"
ON public.material_inventory FOR ALL
USING (
  campanha_id IN (SELECT campanha_id FROM profiles WHERE id = auth.uid())
  OR auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'master'::app_role)
);

CREATE TRIGGER update_material_inventory_updated_at
BEFORE UPDATE ON public.material_inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

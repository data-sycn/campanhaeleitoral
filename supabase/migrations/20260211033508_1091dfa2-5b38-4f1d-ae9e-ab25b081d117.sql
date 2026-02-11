
-- Fase 2.1: Feedback estruturado nos check-ins
CREATE TYPE public.feedback_clima_type AS ENUM ('receptivo', 'neutro', 'hostil');

ALTER TABLE public.street_checkins 
  ADD COLUMN feedback_clima public.feedback_clima_type,
  ADD COLUMN feedback_demandas text,
  ADD COLUMN liderancas_identificadas text;

-- Fase 2.2: Status de cobertura nas ruas
CREATE TYPE public.status_cobertura_type AS ENUM ('nao_visitada', 'em_visitacao', 'concluida', 'necessita_retorno');

ALTER TABLE public.streets 
  ADD COLUMN status_cobertura public.status_cobertura_type NOT NULL DEFAULT 'nao_visitada';

-- Trigger: atualizar status_cobertura automaticamente
CREATE OR REPLACE FUNCTION public.update_street_coverage_status()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
    UPDATE public.streets SET status_cobertura = 'em_visitacao' WHERE id = NEW.street_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'completed' AND OLD.status = 'active' THEN
    UPDATE public.streets SET status_cobertura = 'concluida' WHERE id = NEW.street_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_update_street_coverage
AFTER INSERT OR UPDATE ON public.street_checkins
FOR EACH ROW
EXECUTE FUNCTION public.update_street_coverage_status();

-- Fase 5: Inventário - quantidade utilizada
ALTER TABLE public.resource_requests 
  ADD COLUMN quantidade_utilizada numeric NOT NULL DEFAULT 0;

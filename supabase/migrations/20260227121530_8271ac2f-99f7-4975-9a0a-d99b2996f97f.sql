
-- Ordem correta respeitando foreign keys
DELETE FROM public.route_assignments WHERE campanha_id = 'bdb4fadb-3514-4745-b65d-953a7d0be3e8';
DELETE FROM public.street_checkins WHERE campanha_id = 'bdb4fadb-3514-4745-b65d-953a7d0be3e8';
DELETE FROM public.streets WHERE campanha_id = 'bdb4fadb-3514-4745-b65d-953a7d0be3e8';

-- Soft delete da campanha
UPDATE public.campanhas SET deleted_at = now() WHERE id = 'bdb4fadb-3514-4745-b65d-953a7d0be3e8';

-- Limpar votes do candidate PE
DELETE FROM public.votes_raw WHERE candidate_id = 'bdb4fadb-3514-4745-b65d-953a7d0be3e8';
DELETE FROM public.votes_agg WHERE candidate_id = 'bdb4fadb-3514-4745-b65d-953a7d0be3e8';

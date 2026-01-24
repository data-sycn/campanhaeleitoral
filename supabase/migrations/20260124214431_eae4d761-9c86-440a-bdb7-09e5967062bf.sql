-- Atribuir role admin ao usuário NAILTON ALMEIDA SAMPAIO
INSERT INTO public.user_roles (user_id, role)
VALUES ('2576a40a-0b4b-4932-8cf7-e604d30384b6', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
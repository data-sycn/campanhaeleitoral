
-- Atribuir role admin ao usuário master
INSERT INTO public.user_roles (user_id, role)
VALUES ('1bb87ffb-180a-404b-bbdc-53bf82a23794', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

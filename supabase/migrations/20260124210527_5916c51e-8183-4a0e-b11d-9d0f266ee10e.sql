
-- Remover roles do usuário
DELETE FROM public.user_roles WHERE user_id = '1bb87ffb-180a-404b-bbdc-53bf82a23794';

-- Remover profile do usuário
DELETE FROM public.profiles WHERE id = '1bb87ffb-180a-404b-bbdc-53bf82a23794';

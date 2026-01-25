-- Fix: Add admin role to user nailton.alsampaio@gmail.com with correct user_id
INSERT INTO public.user_roles (user_id, role)
VALUES ('82e84278-b4b2-48fb-a02b-3b533d8adfb8', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;
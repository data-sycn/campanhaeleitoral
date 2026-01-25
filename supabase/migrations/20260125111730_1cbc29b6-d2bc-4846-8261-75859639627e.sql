-- Remove admin role from user with typo email (will be deleted by user)
DELETE FROM public.user_roles 
WHERE user_id = '2576a40a-0b4b-4932-8cf7-e604d30384b6' 
AND role = 'admin';
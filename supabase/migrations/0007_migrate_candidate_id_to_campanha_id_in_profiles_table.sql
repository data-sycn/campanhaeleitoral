-- Update profiles table to set campanha_id from candidate_id
UPDATE profiles 
SET campanha_id = candidate_id 
WHERE candidate_id IS NOT NULL AND campanha_id IS NULL;

-- Clear candidate_id after migration
UPDATE profiles 
SET candidate_id = NULL 
WHERE candidate_id IS NOT NULL;
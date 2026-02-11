-- First, let's check if we have any existing data that needs migration
SELECT COUNT(*) as profile_count FROM profiles WHERE candidate_id IS NOT NULL;
-- Step 1: Add new roles to enum (must be committed separately)
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'master';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'coordinator';
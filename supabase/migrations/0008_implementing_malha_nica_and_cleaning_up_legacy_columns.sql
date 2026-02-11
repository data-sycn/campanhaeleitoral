-- 1. Malha Única: Prevent duplicate streets in the same campaign
ALTER TABLE streets ADD CONSTRAINT unique_street_per_campanha UNIQUE (campanha_id, nome, bairro, cidade);

-- 2. Make legacy candidate_id columns nullable (Optional A from your plan)
ALTER TABLE budgets ALTER COLUMN candidate_id DROP NOT NULL;
ALTER TABLE expenses ALTER COLUMN candidate_id DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN candidate_id DROP NOT NULL;

-- 3. Ensure all budgets and expenses are linked to campanha_id if not already
UPDATE budgets SET campanha_id = candidate_id WHERE campanha_id IS NULL;
UPDATE expenses SET campanha_id = candidate_id WHERE campanha_id IS NULL;
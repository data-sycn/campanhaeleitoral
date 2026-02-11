-- Insert candidate data into campanhas table
INSERT INTO campanhas (id, nome, partido, cargo, created_at, updated_at)
SELECT id, name, party, position, created_at, updated_at
FROM candidates
ON CONFLICT (id) DO NOTHING;
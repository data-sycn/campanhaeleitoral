
CREATE OR REPLACE VIEW public.v_execucao_orcamentaria AS
SELECT 
  b.id AS budget_id,
  b.candidate_id,
  b.year,
  b.total_planned,
  b.campanha_id,
  COALESCE(SUM(e.amount), 0) AS total_spent,
  b.total_planned - COALESCE(SUM(e.amount), 0) AS saldo,
  CASE 
    WHEN b.total_planned > 0 
    THEN ROUND((COALESCE(SUM(e.amount), 0) / b.total_planned) * 100, 2)
    ELSE 0 
  END AS percentual_executado
FROM budgets b
LEFT JOIN expenses e ON e.candidate_id = b.candidate_id
WHERE b.active = true
GROUP BY b.id, b.candidate_id, b.year, b.total_planned, b.campanha_id;

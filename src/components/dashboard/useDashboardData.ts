import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Json } from "@/integrations/supabase/types";

interface DashboardStats {
  totalBudget: number;
  budgetCount: number;
  expensesCount: number;
  totalExpenses: number;
  supportersCount: number;
  reportsCount: number;
}

interface BudgetExecution {
  budget_id: string;
  year: number;
  total_planned: number;
  total_spent: number;
  saldo: number;
  percentual_executado: number;
}

interface HeatmapEntry {
  cidade: string | null;
  bairro: string | null;
  total: number;
}

interface AuditEntry {
  id: string;
  action: string;
  table_name: string;
  created_at: string;
  new_data: Json | null;
  record_id: string | null;
  user_id: string | null;
}

export function useDashboardData(campanhaId?: string | null) {
  const { profile, userRoles } = useAuth();
  const isMaster = userRoles.includes("master");

  const [stats, setStats] = useState<DashboardStats>({
    totalBudget: 0, budgetCount: 0, expensesCount: 0,
    totalExpenses: 0, supportersCount: 0, reportsCount: 0,
  });
  const [budgetExecution, setBudgetExecution] = useState<BudgetExecution[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapEntry[]>([]);
  const [auditData, setAuditData] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Master without campaign filter or user with candidate_id
    if (isMaster || profile?.candidate_id) {
      fetchAll();
    } else if (profile !== undefined) {
      setLoading(false);
    }
  }, [profile, profile?.candidate_id, campanhaId, isMaster]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchStats(), fetchBudgetExecution(), fetchHeatmap(), fetchAudit()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Budgets
    let budgetQuery = supabase.from("budgets").select("total_planned");
    if (campanhaId) budgetQuery = budgetQuery.eq("campanha_id", campanhaId);
    else if (!isMaster && profile?.candidate_id) budgetQuery = budgetQuery.eq("candidate_id", profile.candidate_id);
    const { data: budgets } = await budgetQuery;

    const totalBudget = budgets?.reduce((s, b) => s + Number(b.total_planned), 0) || 0;

    // Expenses
    let expenseQuery = supabase.from("expenses").select("amount");
    if (campanhaId) expenseQuery = expenseQuery.eq("campanha_id", campanhaId);
    else if (!isMaster && profile?.candidate_id) expenseQuery = expenseQuery.eq("candidate_id", profile.candidate_id);
    const { data: expenses } = await expenseQuery;

    const totalExpenses = expenses?.reduce((s, e) => s + Number(e.amount), 0) || 0;

    // Supporters
    let supporterQuery = supabase.from("supporters").select("id");
    if (campanhaId) supporterQuery = supporterQuery.eq("campanha_id", campanhaId);
    const { data: supporters } = await supporterQuery;

    // Reports
    let reportQuery = supabase.from("reports").select("id");
    if (campanhaId) reportQuery = reportQuery.eq("campanha_id", campanhaId);
    const { data: reports } = await reportQuery;

    setStats({
      totalBudget, budgetCount: budgets?.length || 0,
      totalExpenses, expensesCount: expenses?.length || 0,
      supportersCount: supporters?.length || 0,
      reportsCount: reports?.length || 0,
    });
  };

  const fetchBudgetExecution = async () => {
    // Use RPC-like approach querying the view
    let query = supabase.from("v_execucao_orcamentaria" as any).select("*") as any;
    if (campanhaId) query = query.eq("campanha_id", campanhaId);
    else if (!isMaster && profile?.candidate_id) query = query.eq("candidate_id", profile.candidate_id);
    const { data } = await query;
    setBudgetExecution((data as unknown as BudgetExecution[] | null) || []);
  };

  const fetchHeatmap = async () => {
    let query = supabase.from("supporters").select("cidade, bairro");
    if (campanhaId) query = query.eq("campanha_id", campanhaId);
    const { data } = await query;
    if (!data) { setHeatmapData([]); return; }

    // Group by cidade+bairro
    const map = new Map<string, HeatmapEntry>();
    for (const s of data) {
      const key = `${s.cidade || ""}|${s.bairro || ""}`;
      const existing = map.get(key);
      if (existing) { existing.total++; }
      else { map.set(key, { cidade: s.cidade, bairro: s.bairro, total: 1 }); }
    }
    setHeatmapData(Array.from(map.values()).sort((a, b) => b.total - a.total));
  };

  const fetchAudit = async () => {
    let query = supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(50);
    const { data } = await query;
    setAuditData((data as AuditEntry[] | null) || []);
  };

  return { stats, budgetExecution, heatmapData, auditData, loading, refetch: fetchAll };
}

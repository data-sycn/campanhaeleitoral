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

interface SupporterPoint {
  latitude: number | null;
  longitude: number | null;
  nome: string;
  bairro: string | null;
  cidade: string | null;
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

interface ActiveCheckin {
  cidade: string | null;
  bairro: string | null;
  count: number;
}

export function useDashboardData(overrideCampanhaId?: string | null) {
  const { profile, userRoles, campanhaId: profileCampanhaId } = useAuth();
  const isMaster = userRoles.includes("master");

  // Primary filter: override (for master selector) > profile campanha_id
  const campanhaId = isMaster && overrideCampanhaId ? overrideCampanhaId : profileCampanhaId;

  const [stats, setStats] = useState<DashboardStats>({
    totalBudget: 0, budgetCount: 0, expensesCount: 0,
    totalExpenses: 0, supportersCount: 0, reportsCount: 0,
  });
  const [budgetExecution, setBudgetExecution] = useState<BudgetExecution[]>([]);
  const [supporterPoints, setSupporterPoints] = useState<SupporterPoint[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapEntry[]>([]);
  const [auditData, setAuditData] = useState<AuditEntry[]>([]);
  const [activeCheckins, setActiveCheckins] = useState<ActiveCheckin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isMaster || campanhaId) {
      fetchAll();
    } else if (profile !== undefined) {
      setLoading(false);
    }
  }, [profile, campanhaId, overrideCampanhaId, isMaster]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchBudgetExecution(),
        fetchSupporters(),
        fetchAudit(),
        fetchActiveCheckins(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addCampanhaFilter = (query: any) => {
    if (campanhaId) return query.eq("campanha_id", campanhaId);
    return query;
  };

  const fetchStats = async () => {
    let budgetQuery = supabase.from("budgets").select("total_planned");
    budgetQuery = addCampanhaFilter(budgetQuery);
    const { data: budgets } = await budgetQuery;
    const totalBudget = budgets?.reduce((s: number, b: any) => s + Number(b.total_planned), 0) || 0;

    let expenseQuery = supabase.from("expenses").select("amount");
    expenseQuery = addCampanhaFilter(expenseQuery);
    const { data: expenses } = await expenseQuery;
    const totalExpenses = expenses?.reduce((s: number, e: any) => s + Number(e.amount), 0) || 0;

    let supporterQuery = supabase.from("supporters").select("id");
    supporterQuery = addCampanhaFilter(supporterQuery);
    const { data: supporters } = await supporterQuery;

    let reportQuery = supabase.from("reports").select("id");
    reportQuery = addCampanhaFilter(reportQuery);
    const { data: reports } = await reportQuery;

    setStats({
      totalBudget, budgetCount: budgets?.length || 0,
      totalExpenses, expensesCount: expenses?.length || 0,
      supportersCount: supporters?.length || 0,
      reportsCount: reports?.length || 0,
    });
  };

  const fetchBudgetExecution = async () => {
    let query = supabase.from("v_execucao_orcamentaria" as any).select("*") as any;
    if (campanhaId) query = query.eq("campanha_id", campanhaId);
    const { data } = await query;
    setBudgetExecution((data as unknown as BudgetExecution[] | null) || []);
  };

  const fetchSupporters = async () => {
    let query = supabase.from("supporters").select("latitude, longitude, nome, bairro, cidade");
    query = addCampanhaFilter(query);
    const { data } = await query;
    if (!data) {
      setSupporterPoints([]);
      setHeatmapData([]);
      return;
    }

    setSupporterPoints(data);

    // Build heatmap from city/bairro grouping
    const map = new Map<string, HeatmapEntry>();
    for (const s of data) {
      const key = `${s.cidade || ""}|${s.bairro || ""}`;
      const existing = map.get(key);
      if (existing) existing.total++;
      else map.set(key, { cidade: s.cidade, bairro: s.bairro, total: 1 });
    }
    setHeatmapData(Array.from(map.values()).sort((a, b) => b.total - a.total));
  };

  const fetchAudit = async () => {
    const query = supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(50);
    const { data } = await query;
    setAuditData((data as AuditEntry[] | null) || []);
  };

  const fetchActiveCheckins = async () => {
    let query = supabase
      .from("street_checkins" as any)
      .select("streets(cidade, bairro)")
      .eq("status", "active") as any;
    if (campanhaId) query = query.eq("campanha_id", campanhaId);
    const { data } = await query;

    if (!data || data.length === 0) {
      setActiveCheckins([]);
      return;
    }

    // Group by cidade/bairro
    const map = new Map<string, ActiveCheckin>();
    for (const row of data as any[]) {
      const street = row.streets;
      if (!street) continue;
      const key = `${street.cidade || ""}|${street.bairro || ""}`;
      const existing = map.get(key);
      if (existing) existing.count++;
      else map.set(key, { cidade: street.cidade, bairro: street.bairro, count: 1 });
    }
    setActiveCheckins(Array.from(map.values()).sort((a, b) => b.count - a.count));
  };

  return {
    stats,
    budgetExecution,
    supporterPoints,
    heatmapData,
    auditData,
    activeCheckins,
    loading,
    refetch: fetchAll,
  };
}

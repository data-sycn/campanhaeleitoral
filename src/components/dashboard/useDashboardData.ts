import { useState, useEffect, useCallback } from "react";
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

  const fetchStats = useCallback(async (cid: string) => {
    const [budgetsRes, expensesRes, supportersRes, reportsRes] = await Promise.all([
      supabase.from("budgets").select("total_planned").eq("campanha_id", cid),
      supabase.from("expenses").select("amount").eq("campanha_id", cid),
      supabase.from("supporters").select("id").eq("campanha_id", cid),
      supabase.from("reports").select("id").eq("campanha_id", cid),
    ]);

    const totalBudget = budgetsRes.data?.reduce((s, b) => s + Number(b.total_planned), 0) || 0;
    const totalExpenses = expensesRes.data?.reduce((s, e) => s + Number(e.amount), 0) || 0;

    setStats({
      totalBudget,
      budgetCount: budgetsRes.data?.length || 0,
      totalExpenses,
      expensesCount: expensesRes.data?.length || 0,
      supportersCount: supportersRes.data?.length || 0,
      reportsCount: reportsRes.data?.length || 0,
    });
  }, []);

  const fetchExecution = useCallback(async (cid: string) => {
    const { data } = await supabase
      .from("v_execucao_orcamentaria")
      .select("*")
      .eq("campanha_id", cid);
    setBudgetExecution((data as any) || []);
  }, []);

  const fetchSupporters = useCallback(async (cid: string) => {
    const { data } = await supabase
      .from("supporters")
      .select("latitude, longitude, nome, bairro, cidade")
      .eq("campanha_id", cid);
    
    if (data) {
      setSupporterPoints(data as SupporterPoint[]);
      const map = new Map<string, HeatmapEntry>();
      data.forEach((s) => {
        const key = `${s.cidade || ""}|${s.bairro || ""}`;
        const existing = map.get(key);
        if (existing) existing.total++;
        else map.set(key, { cidade: s.cidade, bairro: s.bairro, total: 1 });
      });
      setHeatmapData(Array.from(map.values()).sort((a, b) => b.total - a.total));
    }
  }, []);

  const fetchAudit = useCallback(async () => {
    const { data } = await supabase
      .from("audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setAuditData((data as AuditEntry[]) || []);
  }, []);

  const fetchActiveCheckins = useCallback(async (cid: string) => {
    const { data } = await supabase
      .from("street_checkins")
      .select("streets(cidade, bairro)")
      .eq("status", "active")
      .eq("campanha_id", cid);

    if (data) {
      const map = new Map<string, ActiveCheckin>();
      data.forEach((row: any) => {
        const street = row.streets;
        if (!street) return;
        const key = `${street.cidade || ""}|${street.bairro || ""}`;
        const existing = map.get(key);
        if (existing) existing.count++;
        else map.set(key, { cidade: street.cidade, bairro: street.bairro, count: 1 });
      });
      setActiveCheckins(Array.from(map.values()).sort((a, b) => b.count - a.count));
    }
  }, []);

  const fetchAll = useCallback(async () => {
    if (!campanhaId) {
      if (profile !== undefined) setLoading(false);
      return;
    }
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(campanhaId),
        fetchExecution(campanhaId),
        fetchSupporters(campanhaId),
        fetchAudit(),
        fetchActiveCheckins(campanhaId),
      ]);
    } finally {
      setLoading(false);
    }
  }, [campanhaId, profile, fetchStats, fetchExecution, fetchSupporters, fetchAudit, fetchActiveCheckins]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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
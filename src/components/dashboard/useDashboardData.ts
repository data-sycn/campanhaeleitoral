import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DashboardStats {
  totalBudget: number;
  budgetCount: number;
  expensesCount: number;
  totalExpenses: number;
  supportersCount: number;
  reportsCount: number;
}

export function useDashboardData() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalBudget: 0,
    budgetCount: 0,
    expensesCount: 0,
    totalExpenses: 0,
    supportersCount: 0,
    reportsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.candidate_id) {
      fetchStats();
    }
  }, [profile?.candidate_id]);

  const fetchStats = async () => {
    if (!profile?.candidate_id) return;

    try {
      // Fetch budgets
      const { data: budgets } = await supabase
        .from("budgets")
        .select("total_planned")
        .eq("candidate_id", profile.candidate_id);

      const totalBudget = budgets?.reduce((sum, b) => sum + Number(b.total_planned), 0) || 0;
      const budgetCount = budgets?.length || 0;

      // Fetch expenses
      const { data: expenses } = await supabase
        .from("expenses")
        .select("amount")
        .eq("candidate_id", profile.candidate_id);

      const totalExpenses = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
      const expensesCount = expenses?.length || 0;

      // Fetch supporters
      const { data: supporters } = await supabase
        .from("profiles")
        .select("id")
        .eq("candidate_id", profile.candidate_id);

      const supportersCount = supporters?.length || 0;

      setStats({
        totalBudget,
        budgetCount,
        expensesCount,
        totalExpenses,
        supportersCount,
        reportsCount: 3, // Placeholder - can be expanded later
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchStats };
}

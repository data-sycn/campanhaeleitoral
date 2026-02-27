import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Budget {
  id: string;
  title: string | null;
  year: number | null;
  total_planned: number;
  notes?: string;
  active: boolean;
  created_at: string;
}

export interface BudgetFormData {
  title: string;
  total_planned: string;
  notes: string;
}

export function useBudgetData() {
  const { user, campanhaId, profile } = useAuth();
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchBudgets = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('budgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (campanhaId) {
        query = query.eq('campanha_id', campanhaId);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Erro ao carregar orçamentos",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setBudgets(data || []);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBudget = async (formData: BudgetFormData) => {
    if (!user) return false;

    setCreating(true);

    try {
      if (!campanhaId) {
        toast({
          title: "Erro",
          description: "Você precisa estar vinculado a uma campanha para criar orçamentos",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('budgets')
        .insert({
          candidate_id: profile?.candidate_id || undefined,
          campanha_id: campanhaId,
          title: formData.title,
          total_planned: parseFloat(formData.total_planned),
          notes: formData.notes || null,
          active: true
        } as any);

      if (error) {
        toast({
          title: "Erro ao criar orçamento",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Orçamento criado!",
        description: "Orçamento criado com sucesso."
      });
      
      await fetchBudgets();
      return true;
    } catch (error) {
      console.error('Error creating budget:', error);
      return false;
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [user, campanhaId]);

  const activeBudget = budgets.find(b => b.active);
  const totalPlanned = budgets.reduce((sum, b) => sum + b.total_planned, 0);

  return {
    budgets,
    loading,
    creating,
    activeBudget,
    totalPlanned,
    createBudget,
    refetch: fetchBudgets
  };
}

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Budget {
  id: string;
  year: number;
  total_planned: number;
  notes?: string;
  active: boolean;
  created_at: string;
}

export interface BudgetFormData {
  year: number;
  total_planned: string;
  notes: string;
}

export function useBudgetData() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchBudgets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('year', { ascending: false });

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
      const { data: profile } = await supabase
        .from('profiles')
        .select('candidate_id')
        .eq('id', user.id)
        .single();

      if (!profile?.candidate_id) {
        toast({
          title: "Erro",
          description: "Você precisa estar vinculado a um candidato para criar orçamentos",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('budgets')
        .insert({
          candidate_id: profile.candidate_id,
          year: formData.year,
          total_planned: parseFloat(formData.total_planned),
          notes: formData.notes || null,
          active: true
        });

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
  }, [user]);

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

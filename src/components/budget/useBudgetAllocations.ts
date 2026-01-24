import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type ExpenseCategory = Database["public"]["Enums"]["expense_category"];

export interface BudgetAllocation {
  id: string;
  budget_id: string;
  category: ExpenseCategory;
  planned_amount: number;
  created_at: string;
  updated_at: string;
}

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  publicidade: "Publicidade",
  transporte: "Transporte",
  alimentacao: "Alimentação",
  material: "Material",
  eventos: "Eventos",
  pessoal: "Pessoal",
  outros: "Outros"
};

export const ALL_CATEGORIES: ExpenseCategory[] = [
  "publicidade",
  "transporte",
  "alimentacao",
  "material",
  "eventos",
  "pessoal",
  "outros"
];

export function useBudgetAllocations(budgetId: string | undefined) {
  const { toast } = useToast();
  const [allocations, setAllocations] = useState<BudgetAllocation[]>([]);
  const [expenses, setExpenses] = useState<Record<ExpenseCategory, number>>({} as Record<ExpenseCategory, number>);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAllocations = async () => {
    if (!budgetId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('budget_allocations')
        .select('*')
        .eq('budget_id', budgetId);

      if (error) {
        toast({
          title: "Erro ao carregar alocações",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setAllocations(data || []);
      }
    } catch (error) {
      console.error('Error fetching allocations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpensesByCategory = async (candidateId: string) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('category, amount')
        .eq('candidate_id', candidateId);

      if (error) {
        console.error('Error fetching expenses:', error);
        return;
      }

      const categoryTotals: Record<ExpenseCategory, number> = {
        publicidade: 0,
        transporte: 0,
        alimentacao: 0,
        material: 0,
        eventos: 0,
        pessoal: 0,
        outros: 0
      };

      data?.forEach(expense => {
        categoryTotals[expense.category as ExpenseCategory] += expense.amount;
      });

      setExpenses(categoryTotals);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const saveAllocation = async (category: ExpenseCategory, amount: number) => {
    if (!budgetId) return false;

    setSaving(true);

    try {
      const existingAllocation = allocations.find(a => a.category === category);

      if (existingAllocation) {
        const { error } = await supabase
          .from('budget_allocations')
          .update({ planned_amount: amount })
          .eq('id', existingAllocation.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('budget_allocations')
          .insert({
            budget_id: budgetId,
            category,
            planned_amount: amount
          });

        if (error) throw error;
      }

      toast({
        title: "Alocação salva",
        description: `${CATEGORY_LABELS[category]} atualizado com sucesso.`
      });

      await fetchAllocations();
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao salvar alocação",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveAllAllocations = async (allocationData: Record<ExpenseCategory, number>) => {
    if (!budgetId) return false;

    setSaving(true);

    try {
      for (const category of ALL_CATEGORIES) {
        const amount = allocationData[category] || 0;
        const existingAllocation = allocations.find(a => a.category === category);

        if (existingAllocation) {
          if (existingAllocation.planned_amount !== amount) {
            const { error } = await supabase
              .from('budget_allocations')
              .update({ planned_amount: amount })
              .eq('id', existingAllocation.id);

            if (error) throw error;
          }
        } else if (amount > 0) {
          const { error } = await supabase
            .from('budget_allocations')
            .insert({
              budget_id: budgetId,
              category,
              planned_amount: amount
            });

          if (error) throw error;
        }
      }

      toast({
        title: "Alocações salvas",
        description: "Todas as alocações foram atualizadas com sucesso."
      });

      await fetchAllocations();
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao salvar alocações",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, [budgetId]);

  const totalAllocated = allocations.reduce((sum, a) => sum + a.planned_amount, 0);

  const getAllocationForCategory = (category: ExpenseCategory): number => {
    const allocation = allocations.find(a => a.category === category);
    return allocation?.planned_amount || 0;
  };

  return {
    allocations,
    expenses,
    loading,
    saving,
    totalAllocated,
    getAllocationForCategory,
    saveAllocation,
    saveAllAllocations,
    fetchExpensesByCategory,
    refetch: fetchAllocations
  };
}

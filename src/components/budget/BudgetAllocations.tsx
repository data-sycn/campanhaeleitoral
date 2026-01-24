import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, AlertCircle } from "lucide-react";
import { useBudgetAllocations, ALL_CATEGORIES, CATEGORY_LABELS } from "./useBudgetAllocations";
import { AllocationRow } from "./AllocationRow";
import { useBudgetData, Budget } from "./useBudgetData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(142 76% 36%)',
  'hsl(var(--muted-foreground))'
];

export function BudgetAllocations() {
  const { user, selectedCandidate } = useAuth();
  const { budgets, loading: budgetsLoading } = useBudgetData();
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | undefined>();
  
  const selectedBudget = budgets.find(b => b.id === selectedBudgetId);
  
  const {
    allocations,
    expenses,
    loading: allocationsLoading,
    saving,
    totalAllocated,
    getAllocationForCategory,
    saveAllocation,
    fetchExpensesByCategory
  } = useBudgetAllocations(selectedBudgetId);

  // Auto-select active budget on load
  useEffect(() => {
    if (budgets.length > 0 && !selectedBudgetId) {
      const activeBudget = budgets.find(b => b.active);
      setSelectedBudgetId(activeBudget?.id || budgets[0].id);
    }
  }, [budgets, selectedBudgetId]);

  // Fetch expenses when candidate changes
  useEffect(() => {
    const fetchCandidateExpenses = async () => {
      if (!user) return;
      
      const candidateId = selectedCandidate?.id;
      if (candidateId) {
        fetchExpensesByCategory(candidateId);
      } else {
        // Fallback: get from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('candidate_id')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profile?.candidate_id) {
          fetchExpensesByCategory(profile.candidate_id);
        }
      }
    };

    fetchCandidateExpenses();
  }, [user, selectedCandidate, selectedBudgetId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalBudget = selectedBudget?.total_planned || 0;
  const unallocated = totalBudget - totalAllocated;
  const totalSpent = Object.values(expenses).reduce((sum, v) => sum + v, 0);

  // Prepare pie chart data
  const pieData = ALL_CATEGORIES
    .map((cat, index) => ({
      name: CATEGORY_LABELS[cat],
      value: getAllocationForCategory(cat),
      color: COLORS[index % COLORS.length]
    }))
    .filter(d => d.value > 0);

  if (budgetsLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (budgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Alocações por Categoria
          </CardTitle>
          <CardDescription>
            Distribua o orçamento entre as diferentes categorias de despesas
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum Orçamento Encontrado</h3>
          <p className="text-muted-foreground">
            Crie um orçamento na aba "Orçamentos" para começar a distribuir as alocações.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Budget Selector */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Alocações por Categoria
              </CardTitle>
              <CardDescription>
                Distribua o orçamento entre as diferentes categorias de despesas
              </CardDescription>
            </div>
            <Select value={selectedBudgetId} onValueChange={setSelectedBudgetId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selecione o orçamento" />
              </SelectTrigger>
              <SelectContent>
                {budgets.map((budget) => (
                  <SelectItem key={budget.id} value={budget.id}>
                    {budget.year} {budget.active && "(Ativo)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total do Orçamento</p>
            <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
          </CardContent>
        </Card>
        <Card className="bg-chart-2/10 border-chart-2/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Alocado</p>
            <p className="text-2xl font-bold">{formatCurrency(totalAllocated)}</p>
          </CardContent>
        </Card>
        <Card className={`${unallocated < 0 ? 'bg-destructive/10 border-destructive/20' : 'bg-chart-3/10 border-chart-3/20'}`}>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Não Alocado</p>
            <p className={`text-2xl font-bold ${unallocated < 0 ? 'text-destructive' : ''}`}>
              {formatCurrency(unallocated)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-chart-4/10 border-chart-4/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Gasto</p>
            <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocation Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Categorias</CardTitle>
            <CardDescription>Clique no valor planejado para editar</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {allocationsLoading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 text-sm font-medium text-muted-foreground">
                  <div className="col-span-3 md:col-span-2">Categoria</div>
                  <div className="col-span-4 md:col-span-2">Planejado</div>
                  <div className="col-span-2 hidden md:block">Gasto</div>
                  <div className="col-span-2 hidden md:block">Saldo</div>
                  <div className="col-span-5 md:col-span-4">Progresso</div>
                </div>
                
                {ALL_CATEGORIES.map((category) => (
                  <AllocationRow
                    key={category}
                    category={category}
                    plannedAmount={getAllocationForCategory(category)}
                    spentAmount={expenses[category] || 0}
                    onSave={saveAllocation}
                    saving={saving}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição</CardTitle>
            <CardDescription>Visualização das alocações</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <RechartsPie>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend 
                    layout="vertical" 
                    align="right" 
                    verticalAlign="middle"
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                Nenhuma alocação definida
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

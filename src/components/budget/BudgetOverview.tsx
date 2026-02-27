import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Budget } from "./useBudgetData";
import { BudgetExecutionChart } from "@/components/dashboard/BudgetExecutionChart";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BudgetExecution {
  budget_id: string;
  year: number;
  total_planned: number;
  total_spent: number;
  saldo: number;
  percentual_executado: number;
}

interface BudgetOverviewProps {
  budgets: Budget[];
  activeBudget?: Budget;
}

export function BudgetOverview({ budgets, activeBudget }: BudgetOverviewProps) {
  const { campanhaId, isMaster } = useAuth();
  const [budgetExecution, setBudgetExecution] = useState<BudgetExecution[]>([]);

  useEffect(() => {
    const fetchExecution = async () => {
      let query = supabase
        .from("v_execucao_orcamentaria")
        .select("*");
      if (campanhaId) {
        query = query.eq("campanha_id", campanhaId);
      }
      const { data } = await query;
      setBudgetExecution((data as any[]) || []);
    };
    fetchExecution();
  }, [campanhaId]);

  const totalPlanned = activeBudget?.total_planned || 0;
  // TODO: Fetch actual spent from expenses
  const totalSpent = 0;
  const remaining = totalPlanned - totalSpent;
  const spentPercentage = totalPlanned > 0 ? (totalSpent / totalPlanned) * 100 : 0;
  const isOverBudget = spentPercentage > 100;
  const isWarning = spentPercentage > 80 && !isOverBudget;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Planejado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(totalPlanned)}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeBudget?.title || `Orçamento ${activeBudget?.year || new Date().getFullYear()}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalSpent)}
            </div>
            <p className="text-xs text-muted-foreground">
              {spentPercentage.toFixed(1)}% do orçamento
            </p>
          </CardContent>
        </Card>

        <Card className={isOverBudget ? "border-destructive" : isWarning ? "border-yellow-500" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
            {isOverBudget ? (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            ) : isWarning ? (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isOverBudget ? "text-destructive" : ""}`}>
              {formatCurrency(remaining)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isOverBudget ? "Orçamento excedido!" : isWarning ? "Atenção: limite próximo" : "Disponível para uso"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso do Orçamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Utilização</span>
              <span className={isOverBudget ? "text-destructive font-medium" : ""}>
                {spentPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={Math.min(spentPercentage, 100)} 
              className={isOverBudget ? "[&>div]:bg-destructive" : isWarning ? "[&>div]:bg-yellow-500" : ""}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Orçamentos Ativos</p>
              <p className="text-xl font-semibold">{budgets.filter(b => b.active).length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Orçamentos</p>
              <p className="text-xl font-semibold">{budgets.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Execution Chart */}
      <BudgetExecutionChart data={budgetExecution} loading={false} />

      {/* Warning Alert */}
      {isWarning && !isOverBudget && (
        <Card className="border-yellow-500 bg-yellow-500/10">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="font-medium">Atenção: Orçamento próximo do limite</p>
              <p className="text-sm text-muted-foreground">
                Você já utilizou mais de 80% do orçamento planejado.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isOverBudget && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Orçamento Excedido!</p>
              <p className="text-sm text-muted-foreground">
                Os gastos ultrapassaram o valor planejado em {formatCurrency(Math.abs(remaining))}.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

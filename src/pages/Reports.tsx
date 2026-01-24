import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, BarChart3, PieChart, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';

interface ExpenseData {
  category: string;
  amount: number;
  count: number;
}

interface MonthlyData {
  month: string;
  expenses: number;
}

const Reports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [expensesByCategory, setExpensesByCategory] = useState<ExpenseData[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyData[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);

  const categoryColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'
  ];

  const categoryLabels: Record<string, string> = {
    publicidade: 'Publicidade',
    transporte: 'Transporte',
    alimentacao: 'Alimentação',
    material: 'Material',
    eventos: 'Eventos',
    pessoal: 'Pessoal',
    outros: 'Outros'
  };

  useEffect(() => {
    fetchReportData();
  }, [user]);

  const fetchReportData = async () => {
    if (!user) return;

    try {
      // Fetch expenses data
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('category, amount, date');

      if (expensesError) throw expensesError;

      // Fetch budget data
      const { data: budgets, error: budgetsError } = await supabase
        .from('budgets')
        .select('total_planned')
        .eq('active', true)
        .single();

      if (budgetsError && budgetsError.code !== 'PGRST116') throw budgetsError;

      // Process expenses by category
      const categoryData: Record<string, { amount: number, count: number }> = {};
      let total = 0;

      expenses?.forEach(expense => {
        if (!categoryData[expense.category]) {
          categoryData[expense.category] = { amount: 0, count: 0 };
        }
        categoryData[expense.category].amount += expense.amount;
        categoryData[expense.category].count += 1;
        total += expense.amount;
      });

      const categoryArray = Object.entries(categoryData).map(([category, data]) => ({
        category: categoryLabels[category] || category,
        amount: data.amount,
        count: data.count
      }));

      // Process monthly expenses
      const monthlyData: Record<string, number> = {};
      expenses?.forEach(expense => {
        const date = new Date(expense.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + expense.amount;
      });

      const monthlyArray = Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, expenses]) => ({
          month: new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
          expenses
        }));

      setExpensesByCategory(categoryArray);
      setMonthlyExpenses(monthlyArray);
      setTotalExpenses(total);
      setTotalBudget(budgets?.total_planned || 0);

    } catch (error) {
      console.error('Error fetching report data:', error);
      toast({
        title: "Erro ao carregar dados do relatório",
        description: "Não foi possível carregar os dados para o relatório.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const budgetUsedPercentage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  const handleExportPDF = () => {
    // In a real implementation, you would generate and download a PDF
    toast({
      title: "Exportação em desenvolvimento",
      description: "A funcionalidade de exportação para PDF será implementada em breve."
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Análises e relatórios da campanha</p>
        </div>
        <Button 
          onClick={handleExportPDF}
          variant="campaign"
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar PDF
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  R$ {totalExpenses.toLocaleString('pt-BR', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
                </h3>
                <p className="text-muted-foreground">Total Gasto</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 gradient-civic rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  R$ {totalBudget.toLocaleString('pt-BR', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
                </h3>
                <p className="text-muted-foreground">Orçamento Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  {budgetUsedPercentage.toFixed(1)}%
                </h3>
                <p className="text-muted-foreground">Orçamento Usado</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Expenses by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Gastos por Categoria
            </CardTitle>
            <CardDescription>
              Distribuição dos gastos por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart data={expensesByCategory}>
                  <Tooltip 
                    formatter={(value: number) => [
                      `R$ ${value.toLocaleString('pt-BR', { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2 
                      })}`,
                      'Valor'
                    ]}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Expenses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Gastos Mensais
            </CardTitle>
            <CardDescription>
              Evolução dos gastos ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyExpenses.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyExpenses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [
                      `R$ ${value.toLocaleString('pt-BR', { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2 
                      })}`,
                      'Gastos'
                    ]}
                  />
                  <Bar dataKey="expenses" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Categoria</CardTitle>
          <CardDescription>
            Resumo detalhado dos gastos por categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expensesByCategory.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
                  />
                  <div>
                    <h4 className="font-medium">{category.category}</h4>
                    <p className="text-sm text-muted-foreground">{category.count} transações</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    R$ {category.amount.toLocaleString('pt-BR', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {((category.amount / totalExpenses) * 100).toFixed(1)}% do total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
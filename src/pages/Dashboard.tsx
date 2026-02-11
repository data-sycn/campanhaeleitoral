import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Users, FileText, BarChart3, PieChart, Shield, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardData } from "@/components/dashboard/useDashboardData";
import { ModuleSwitcher } from "@/components/navigation/ModuleSwitcher";
import { CampaignSelector } from "@/components/dashboard/CampaignSelector";
import { BudgetExecutionChart } from "@/components/dashboard/BudgetExecutionChart";
import { SupportersHeatmap } from "@/components/dashboard/SupportersHeatmap";
import { AuditTimeline } from "@/components/dashboard/AuditTimeline";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const Dashboard = () => {
  const { userRoles } = useAuth();
  const isMaster = userRoles.includes("master");
  const [campanhaId, setCampanhaId] = useState<string | null>(null);
  const { stats, budgetExecution, heatmapData, auditData, loading } = useDashboardData(campanhaId);
  const [activeTab, setActiveTab] = useState("overview");

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const kpis = [
    { title: "Orçamento Total", value: formatCurrency(stats.totalBudget), icon: DollarSign, color: "text-green-600", bgColor: "bg-green-500/10" },
    { title: "Despesas", value: formatCurrency(stats.totalExpenses), icon: TrendingUp, color: "text-red-600", bgColor: "bg-red-500/10" },
    { title: "Apoiadores", value: stats.supportersCount.toString(), icon: Users, color: "text-purple-600", bgColor: "bg-purple-500/10" },
    { title: "Relatórios", value: stats.reportsCount.toString(), icon: FileText, color: "text-orange-600", bgColor: "bg-orange-500/10" },
  ];

  const categoryData = budgetExecution.map((b) => ({
    name: `${b.year}`,
    value: Number(b.total_spent) || 1,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-muted rounded-lg" />)}
            </div>
            <div className="h-80 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6"><ModuleSwitcher /></div>

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral da campanha</p>
          </div>
          {isMaster && <CampaignSelector value={campanhaId} onChange={setCampanhaId} />}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2"><BarChart3 className="w-4 h-4" /> Visão Geral</TabsTrigger>
            <TabsTrigger value="charts" className="gap-2"><PieChart className="w-4 h-4" /> Gráficos</TabsTrigger>
            <TabsTrigger value="audit" className="gap-2"><Shield className="w-4 h-4" /> Auditoria</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((kpi) => (
                <Card key={kpi.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                    <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                      <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Budget Execution Chart + Heatmap */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BudgetExecutionChart data={budgetExecution} loading={false} />
              <SupportersHeatmap data={heatmapData} loading={false} />
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart - Gastos por ano */}
              <Card>
                <CardHeader><CardTitle>Distribuição de Gastos</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-80">
                    {categoryData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie data={categoryData} cx="50%" cy="50%" labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100} dataKey="value">
                            {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip /><Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Sem dados</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Summary Card */}
              <Card>
                <CardHeader><CardTitle>Resumo Financeiro</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-lg">
                    <span className="font-medium">Orçamento Planejado</span>
                    <span className="text-xl font-bold text-green-600">{formatCurrency(stats.totalBudget)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-500/10 rounded-lg">
                    <span className="font-medium">Total Gasto</span>
                    <span className="text-xl font-bold text-red-600">{formatCurrency(stats.totalExpenses)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-500/10 rounded-lg">
                    <span className="font-medium">Saldo Disponível</span>
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(stats.totalBudget - stats.totalExpenses)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-500/10 rounded-lg">
                    <span className="font-medium">% Utilizado</span>
                    <span className="text-xl font-bold text-purple-600">
                      {stats.totalBudget > 0 ? ((stats.totalExpenses / stats.totalBudget) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit">
            <AuditTimeline data={auditData} loading={false} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;

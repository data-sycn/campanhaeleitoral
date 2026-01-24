import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, DollarSign, Users, FileText, BarChart3, PieChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardData } from "@/components/dashboard/useDashboardData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { stats, loading } = useDashboardData();
  const [activeTab, setActiveTab] = useState("overview");

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Mock data for charts - in production, fetch from Supabase
  const monthlyData = [
    { month: "Jan", receitas: 15000, despesas: 12000 },
    { month: "Fev", receitas: 18000, despesas: 14000 },
    { month: "Mar", receitas: 22000, despesas: 18000 },
    { month: "Abr", receitas: 25000, despesas: 20000 },
    { month: "Mai", receitas: 30000, despesas: 24000 },
    { month: "Jun", receitas: 28000, despesas: 22000 },
  ];

  const categoryData = [
    { name: "Publicidade", value: 35 },
    { name: "Eventos", value: 25 },
    { name: "Material", value: 20 },
    { name: "Transporte", value: 12 },
    { name: "Outros", value: 8 },
  ];

  const kpis = [
    {
      title: "Orçamento Total",
      value: formatCurrency(stats.totalBudget),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Despesas",
      value: formatCurrency(stats.totalExpenses),
      icon: TrendingUp,
      color: "text-red-600",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Apoiadores",
      value: stats.supportersCount.toString(),
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Relatórios",
      value: stats.reportsCount.toString(),
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
            <div className="h-80 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-4 gap-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar aos Módulos
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da campanha</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="charts" className="gap-2">
              <PieChart className="w-4 h-4" />
              Gráficos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((kpi) => (
                <Card key={kpi.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {kpi.title}
                    </CardTitle>
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

            {/* Monthly Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Receitas vs Despesas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(value) => `R$${value/1000}k`} />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="receitas" fill="#22c55e" name="Receitas" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="despesas" fill="#ef4444" name="Despesas" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Despesas por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumo Financeiro</CardTitle>
                </CardHeader>
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
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(stats.totalBudget - stats.totalExpenses)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-500/10 rounded-lg">
                    <span className="font-medium">% Utilizado</span>
                    <span className="text-xl font-bold text-purple-600">
                      {stats.totalBudget > 0 
                        ? ((stats.totalExpenses / stats.totalBudget) * 100).toFixed(1) 
                        : 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;

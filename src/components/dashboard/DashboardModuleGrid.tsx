import { BarChart3, DollarSign, Receipt, Users, FileText } from "lucide-react";
import { DashboardModuleCard } from "./DashboardModuleCard";
import { useDashboardData } from "./useDashboardData";
import { useAuth } from "@/hooks/useAuth";

export function DashboardModuleGrid() {
  const { stats, loading } = useDashboardData();
  const { profile } = useAuth();
  const hasCandidate = !!profile?.candidate_id;

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const modules = [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "Visão geral da campanha com KPIs, atividades recentes e métricas de desempenho",
      icon: BarChart3,
      route: "/dashboard",
      color: "blue" as const,
      stats: "4 KPIs ativos",
    },
    {
      id: "budget",
      title: "Orçamento",
      description: "Crie e gerencie os orçamentos da campanha, alocações e planejamento financeiro",
      icon: DollarSign,
      route: "/budget",
      color: "green" as const,
      stats: loading ? "Carregando..." : hasCandidate ? `${formatCurrency(stats.totalBudget)} planejado` : "Configure seu candidato",
    },
    {
      id: "expenses",
      title: "Despesas",
      description: "Controle de gastos, categorização e acompanhamento de todas as despesas",
      icon: Receipt,
      route: "/expenses",
      color: "red" as const,
      stats: loading ? "Carregando..." : hasCandidate ? `${stats.expensesCount} despesas registradas` : "Configure seu candidato",
    },
    {
      id: "supporters",
      title: "Apoiadores",
      description: "Gestão de equipe, convites e acompanhamento dos membros da campanha",
      icon: Users,
      route: "/supporters",
      color: "purple" as const,
      stats: loading ? "Carregando..." : hasCandidate ? `${stats.supportersCount} apoiadores` : "Configure seu candidato",
    },
    {
      id: "reports",
      title: "Relatórios",
      description: "Documentos, análises e relatórios para prestação de contas eleitorais",
      icon: FileText,
      route: "/reports",
      color: "orange" as const,
      stats: `${stats.reportsCount} relatórios disponíveis`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module) => (
        <DashboardModuleCard key={module.id} {...module} />
      ))}
    </div>
  );
}

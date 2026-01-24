import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, DollarSign, PieChart, ArrowRight } from "lucide-react";

interface BudgetModuleGridProps {
  onModuleSelect: (module: string) => void;
  budgetCount: number;
  totalPlanned: number;
}

const modules = [
  {
    id: "overview",
    title: "Visão Geral",
    description: "Dashboard com resumo financeiro, KPIs e progresso do orçamento",
    icon: BarChart3,
    color: "bg-blue-500/10 text-blue-500",
    borderColor: "hover:border-blue-500/50"
  },
  {
    id: "budgets",
    title: "Orçamentos",
    description: "Crie e gerencie os orçamentos anuais da campanha",
    icon: DollarSign,
    color: "bg-green-500/10 text-green-500",
    borderColor: "hover:border-green-500/50"
  },
  {
    id: "allocations",
    title: "Alocações",
    description: "Distribua o orçamento por categorias de despesas",
    icon: PieChart,
    color: "bg-purple-500/10 text-purple-500",
    borderColor: "hover:border-purple-500/50"
  }
];

export function BudgetModuleGrid({ onModuleSelect, budgetCount, totalPlanned }: BudgetModuleGridProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getModuleStats = (moduleId: string) => {
    switch (moduleId) {
      case "overview":
        return `${budgetCount} orçamento(s) ativo(s)`;
      case "budgets":
        return formatCurrency(totalPlanned);
      case "allocations":
        return "Em desenvolvimento";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Módulos de Orçamento</h2>
        <p className="text-muted-foreground">Selecione um módulo para gerenciar</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card 
              key={module.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${module.borderColor} group`}
              onClick={() => onModuleSelect(module.id)}
            >
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <CardTitle className="flex items-center justify-between">
                  {module.title}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {getModuleStats(module.id)}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onModuleSelect(module.id);
                    }}
                  >
                    Acessar
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

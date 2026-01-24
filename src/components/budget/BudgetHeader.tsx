import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart3, DollarSign, PieChart } from "lucide-react";

interface BudgetHeaderProps {
  activeModule: string;
  onAction?: () => void;
}

export function BudgetHeader({ activeModule, onAction }: BudgetHeaderProps) {
  const getModuleInfo = () => {
    switch (activeModule) {
      case "overview":
        return {
          title: "Visão Geral",
          description: "Resumo financeiro da campanha",
          icon: BarChart3,
          actionLabel: null
        };
      case "budgets":
        return {
          title: "Orçamentos",
          description: "Gerencie os orçamentos da campanha",
          icon: DollarSign,
          actionLabel: "Novo Orçamento"
        };
      case "allocations":
        return {
          title: "Alocações",
          description: "Distribua o orçamento por categoria",
          icon: PieChart,
          actionLabel: "Nova Alocação"
        };
      default:
        return {
          title: "Orçamento",
          description: "Gerencie o orçamento da campanha",
          icon: DollarSign,
          actionLabel: null
        };
    }
  };

  const moduleInfo = getModuleInfo();
  const Icon = moduleInfo.icon;

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{moduleInfo.title}</h1>
          <p className="text-muted-foreground">{moduleInfo.description}</p>
        </div>
      </div>
      {moduleInfo.actionLabel && onAction && (
        <Button onClick={onAction} variant="campaign" className="gap-2">
          <PlusCircle className="w-4 h-4" />
          {moduleInfo.actionLabel}
        </Button>
      )}
    </div>
  );
}

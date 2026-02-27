import { useState } from "react";
import {
  BudgetModuleTabs,
  BudgetOverview,
  BudgetLoadingSkeleton,
  useBudgetData,
} from "@/components/budget";
import { BudgetPlanned } from "@/components/budget/BudgetPlanned";
import { BudgetExecuted } from "@/components/budget/BudgetExecuted";
import { Navbar } from "@/components/Navbar";
import { CampaignSelector } from "@/components/dashboard/CampaignSelector";
import { useAuth } from "@/hooks/useAuth";

const Budget = () => {
  const { isMaster } = useAuth();
  const [activeModule, setActiveModule] = useState<string>("overview");
  const [selectedCampanha, setSelectedCampanha] = useState<string | null>(null);
  const { budgets, loading, creating, activeBudget, createBudget, updateBudget, deleteBudget } = useBudgetData(selectedCampanha);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <BudgetLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Financeiro</h1>
            <p className="text-muted-foreground">Gerencie o orçamento e as finanças da campanha</p>
          </div>
          {isMaster && <CampaignSelector value={selectedCampanha} onChange={setSelectedCampanha} />}
        </div>

        <BudgetModuleTabs activeModule={activeModule} onModuleChange={setActiveModule} />

        {activeModule === "overview" && (
          <BudgetOverview budgets={budgets} activeBudget={activeBudget} />
        )}

        {activeModule === "planned" && (
          <BudgetPlanned
            budgets={budgets}
            activeBudget={activeBudget}
            creating={creating}
            createBudget={createBudget}
            updateBudget={updateBudget}
            deleteBudget={deleteBudget}
          />
        )}

        {activeModule === "executed" && (
          <BudgetExecuted />
        )}
      </div>
    </div>
  );
};

export default Budget;

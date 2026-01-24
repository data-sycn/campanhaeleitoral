import { useState } from "react";
import {
  BudgetHeader,
  BudgetModuleTabs,
  BudgetModuleGrid,
  BudgetOverview,
  BudgetForm,
  BudgetList,
  BudgetAllocations,
  BudgetLoadingSkeleton,
  useBudgetData
} from "@/components/budget";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Budget = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { budgets, loading, creating, activeBudget, totalPlanned, createBudget } = useBudgetData();

  const handleCreateBudget = async (formData: Parameters<typeof createBudget>[0]) => {
    const success = await createBudget(formData);
    if (success) {
      setShowForm(false);
    }
    return success;
  };

  const handleAction = () => {
    if (activeModule === "budgets") {
      setShowForm(!showForm);
    }
  };

  const handleBackToGrid = () => {
    setActiveModule(null);
    setShowForm(false);
  };

  if (loading) {
    return <BudgetLoadingSkeleton />;
  }

  // Página inicial com grid de módulos
  if (activeModule === null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Orçamento</h1>
          <p className="text-muted-foreground">Gerencie o orçamento da campanha</p>
        </div>
        
        <BudgetModuleGrid 
          onModuleSelect={setActiveModule}
          budgetCount={budgets.filter(b => b.active).length}
          totalPlanned={totalPlanned}
        />
      </div>
    );
  }

  // Visualização do módulo selecionado
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-4 gap-2"
        onClick={handleBackToGrid}
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar aos Módulos
      </Button>

      <BudgetHeader activeModule={activeModule} onAction={handleAction} />
      
      <BudgetModuleTabs 
        activeModule={activeModule} 
        onModuleChange={setActiveModule} 
      />

      {activeModule === "overview" && (
        <BudgetOverview budgets={budgets} activeBudget={activeBudget} />
      )}

      {activeModule === "budgets" && (
        <>
          {showForm && (
            <BudgetForm
              onSubmit={handleCreateBudget}
              onCancel={() => setShowForm(false)}
              isSubmitting={creating}
            />
          )}
          <BudgetList budgets={budgets} onCreateClick={() => setShowForm(true)} />
        </>
      )}

      {activeModule === "allocations" && <BudgetAllocations />}
    </div>
  );
};

export default Budget;

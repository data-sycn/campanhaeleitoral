import { useState } from "react";
import {
  BudgetHeader,
  BudgetModuleTabs,
  BudgetOverview,
  BudgetForm,
  BudgetList,
  BudgetAllocations,
  BudgetLoadingSkeleton,
  useBudgetData
} from "@/components/budget";

const Budget = () => {
  const [activeModule, setActiveModule] = useState<string>("overview");
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


  if (loading) {
    return <BudgetLoadingSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Orçamento</h1>
        <p className="text-muted-foreground">Gerencie o orçamento da campanha</p>
      </div>

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

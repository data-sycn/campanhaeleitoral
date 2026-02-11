import { useState } from "react";
import {
  BudgetHeader,
  BudgetModuleTabs,
  BudgetOverview,
  BudgetForm,
  BudgetList,
  BudgetAllocations,
  BudgetExpenses,
  BudgetLoadingSkeleton,
  NewAllocationDialog,
  useBudgetData,
  useBudgetAllocations
} from "@/components/budget";

import { Navbar } from "@/components/Navbar";

const Budget = () => {
  const [activeModule, setActiveModule] = useState<string>("overview");
  const [showForm, setShowForm] = useState(false);
  const [isAllocationDialogOpen, setIsAllocationDialogOpen] = useState(false);
  
  const { budgets, loading, creating, activeBudget, createBudget } = useBudgetData();
  
  // Hook para gerenciar alocações (usado para o botão global de Nova Alocação)
  const { saveAllocation, saving: savingAllocation } = useBudgetAllocations(activeBudget?.id);

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
    } else if (activeModule === "allocations") {
      setIsAllocationDialogOpen(true);
    }
  };

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

      {activeModule === "allocations" && (
        <>
          <BudgetAllocations />
          <NewAllocationDialog 
            isOpen={isAllocationDialogOpen}
            onOpenChange={setIsAllocationDialogOpen}
            onSave={saveAllocation}
            isSaving={savingAllocation}
          />
        </>
      )}

      {activeModule === "expenses" && (
        <BudgetExpenses />
      )}
    </div>
    </div>
  );
};

export default Budget;
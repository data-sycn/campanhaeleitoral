import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, PieChart } from "lucide-react";
import { BudgetForm } from "./BudgetForm";
import { BudgetList } from "./BudgetList";
import { BudgetAllocations } from "./BudgetAllocations";
import { NewAllocationDialog } from "./NewAllocationDialog";
import { useBudgetData, BudgetFormData } from "./useBudgetData";
import { useBudgetAllocations } from "./useBudgetAllocations";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface BudgetPlannedProps {
  budgets: ReturnType<typeof useBudgetData>["budgets"];
  activeBudget: ReturnType<typeof useBudgetData>["activeBudget"];
  creating: boolean;
  createBudget: (data: BudgetFormData) => Promise<boolean>;
}

export function BudgetPlanned({ budgets, activeBudget, creating, createBudget }: BudgetPlannedProps) {
  const [subTab, setSubTab] = useState("budgets");
  const [showForm, setShowForm] = useState(false);
  const [isAllocationDialogOpen, setIsAllocationDialogOpen] = useState(false);
  const { saveAllocation, saving: savingAllocation } = useBudgetAllocations(activeBudget?.id);

  const handleCreateBudget = async (formData: BudgetFormData) => {
    const success = await createBudget(formData);
    if (success) setShowForm(false);
    return success;
  };

  return (
    <div className="space-y-4">
      <Tabs value={subTab} onValueChange={setSubTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="budgets" className="gap-2">
              <DollarSign className="w-4 h-4" />
              Orçamentos
            </TabsTrigger>
            <TabsTrigger value="allocations" className="gap-2">
              <PieChart className="w-4 h-4" />
              Alocações
            </TabsTrigger>
          </TabsList>

          {subTab === "budgets" && (
            <Button onClick={() => setShowForm(!showForm)} variant="campaign" className="gap-2">
              <PlusCircle className="w-4 h-4" /> Novo Orçamento
            </Button>
          )}
          {subTab === "allocations" && (
            <Button onClick={() => setIsAllocationDialogOpen(true)} variant="campaign" className="gap-2">
              <PlusCircle className="w-4 h-4" /> Nova Alocação
            </Button>
          )}
        </div>

        <TabsContent value="budgets" className="space-y-4">
          {showForm && (
            <BudgetForm onSubmit={handleCreateBudget} onCancel={() => setShowForm(false)} isSubmitting={creating} />
          )}
          <BudgetList budgets={budgets} onCreateClick={() => setShowForm(true)} />
        </TabsContent>

        <TabsContent value="allocations" className="space-y-4">
          <BudgetAllocations />
          <NewAllocationDialog
            isOpen={isAllocationDialogOpen}
            onOpenChange={setIsAllocationDialogOpen}
            onSave={saveAllocation}
            isSaving={savingAllocation}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

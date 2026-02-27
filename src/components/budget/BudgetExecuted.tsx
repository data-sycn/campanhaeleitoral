import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Banknote, Receipt } from "lucide-react";
import { BudgetRevenues } from "./BudgetRevenues";
import { BudgetExpenses } from "./BudgetExpenses";

export function BudgetExecuted() {
  const [subTab, setSubTab] = useState("revenues");

  return (
    <div className="space-y-4">
      <Tabs value={subTab} onValueChange={setSubTab}>
        <TabsList>
          <TabsTrigger value="revenues" className="gap-2">
            <Banknote className="w-4 h-4" />
            Receitas
          </TabsTrigger>
          <TabsTrigger value="expenses" className="gap-2">
            <Receipt className="w-4 h-4" />
            Despesas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenues">
          <BudgetRevenues />
        </TabsContent>

        <TabsContent value="expenses">
          <BudgetExpenses />
        </TabsContent>
      </Tabs>
    </div>
  );
}

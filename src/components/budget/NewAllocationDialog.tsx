import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALL_CATEGORIES, CATEGORY_LABELS } from "./useBudgetAllocations";
import { Database } from "@/integrations/supabase/types";
import { Loader2 } from "lucide-react";

type ExpenseCategory = Database["public"]["Enums"]["expense_category"];

interface NewAllocationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (category: ExpenseCategory, amount: number) => Promise<boolean>;
  isSaving: boolean;
}

export function NewAllocationDialog({ 
  isOpen, 
  onOpenChange, 
  onSave, 
  isSaving 
}: NewAllocationDialogProps) {
  const [category, setCategory] = useState<ExpenseCategory | "">("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) return;

    const success = await onSave(category as ExpenseCategory, parseFloat(amount));
    if (success) {
      setCategory("");
      setAmount("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Alocação</DialogTitle>
          <DialogDescription>
            Defina o valor planejado para uma categoria de despesa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select 
              value={category} 
              onValueChange={(value) => setCategory(value as ExpenseCategory)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {ALL_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Valor Planejado (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving || !category || !amount} variant="campaign">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alocação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { CATEGORY_LABELS } from "./useBudgetAllocations";

type ExpenseCategory = Database["public"]["Enums"]["expense_category"];

interface AllocationRowProps {
  category: ExpenseCategory;
  plannedAmount: number;
  spentAmount: number;
  onSave: (category: ExpenseCategory, amount: number) => Promise<boolean>;
  saving: boolean;
}

export function AllocationRow({
  category,
  plannedAmount,
  spentAmount,
  onSave,
  saving
}: AllocationRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(plannedAmount.toString());

  useEffect(() => {
    setEditValue(plannedAmount.toString());
  }, [plannedAmount]);

  const handleSave = async () => {
    const amount = parseFloat(editValue) || 0;
    const success = await onSave(category, amount);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(plannedAmount.toString());
    setIsEditing(false);
  };

  const percentage = plannedAmount > 0 ? Math.min((spentAmount / plannedAmount) * 100, 100) : 0;
  const isOverBudget = spentAmount > plannedAmount && plannedAmount > 0;
  const remaining = plannedAmount - spentAmount;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="grid grid-cols-12 gap-4 items-center p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
      <div className="col-span-3 md:col-span-2">
        <span className="font-medium text-sm">{CATEGORY_LABELS[category]}</span>
      </div>
      
      <div className="col-span-4 md:col-span-2">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <Input
              type="number"
              step="0.01"
              min="0"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-8 text-sm"
              disabled={saving}
            />
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 shrink-0" 
              onClick={handleSave}
              disabled={saving}
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 shrink-0" 
              onClick={handleCancel}
              disabled={saving}
            >
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ) : (
          <span 
            className="text-sm cursor-pointer hover:underline"
            onClick={() => setIsEditing(true)}
          >
            {formatCurrency(plannedAmount)}
          </span>
        )}
      </div>
      
      <div className="col-span-2 hidden md:block">
        <span className={`text-sm ${isOverBudget ? 'text-destructive font-medium' : ''}`}>
          {formatCurrency(spentAmount)}
        </span>
      </div>
      
      <div className="col-span-2 hidden md:block">
        <span className={`text-sm ${remaining < 0 ? 'text-destructive' : 'text-green-600'}`}>
          {formatCurrency(remaining)}
        </span>
      </div>
      
      <div className="col-span-5 md:col-span-4">
        <div className="flex items-center gap-2">
          <Progress 
            value={percentage} 
            className={`h-2 flex-1 ${isOverBudget ? '[&>div]:bg-destructive' : ''}`}
          />
          <span className={`text-xs w-12 text-right ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}

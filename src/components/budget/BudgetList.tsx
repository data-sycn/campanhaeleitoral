import { Budget } from "./useBudgetData";
import { BudgetCard } from "./BudgetCard";
import { BudgetEmptyState } from "./BudgetEmptyState";

interface BudgetListProps {
  budgets: Budget[];
  onCreateClick: () => void;
  onUpdate: (id: string, data: Partial<{ title: string; total_planned: number; notes: string | null; active: boolean }>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export function BudgetList({ budgets, onCreateClick, onUpdate, onDelete }: BudgetListProps) {
  if (budgets.length === 0) {
    return <BudgetEmptyState onCreateClick={onCreateClick} />;
  }

  return (
    <div className="grid gap-6">
      {budgets.map((budget) => (
        <BudgetCard key={budget.id} budget={budget} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  );
}

import { Budget } from "./useBudgetData";
import { BudgetCard } from "./BudgetCard";
import { BudgetEmptyState } from "./BudgetEmptyState";

interface BudgetListProps {
  budgets: Budget[];
  onCreateClick: () => void;
}

export function BudgetList({ budgets, onCreateClick }: BudgetListProps) {
  if (budgets.length === 0) {
    return <BudgetEmptyState onCreateClick={onCreateClick} />;
  }

  return (
    <div className="grid gap-6">
      {budgets.map((budget) => (
        <BudgetCard key={budget.id} budget={budget} />
      ))}
    </div>
  );
}

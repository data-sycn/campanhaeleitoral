import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Budget } from "./useBudgetData";

interface BudgetCardProps {
  budget: Budget;
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const displayName = budget.title || `Orçamento ${budget.year || ''}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{displayName}</span>
          {budget.active && (
            <Badge variant="default" className="bg-primary">
              Ativo
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Criado em {new Date(budget.created_at).toLocaleDateString('pt-BR')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg text-primary">
              {formatCurrency(budget.total_planned)}
            </h4>
            <p className="text-sm text-muted-foreground">Valor total planejado</p>
          </div>
          {budget.notes && (
            <div>
              <h5 className="font-medium">Observações:</h5>
              <p className="text-sm text-muted-foreground">{budget.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

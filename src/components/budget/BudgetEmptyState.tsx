import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

interface BudgetEmptyStateProps {
  onCreateClick: () => void;
}

export function BudgetEmptyState({ onCreateClick }: BudgetEmptyStateProps) {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <DollarSign className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum orçamento encontrado</h3>
        <p className="text-muted-foreground mb-4">
          Comece criando seu primeiro orçamento de campanha
        </p>
        <Button onClick={onCreateClick} variant="campaign">
          Criar Primeiro Orçamento
        </Button>
      </CardContent>
    </Card>
  );
}

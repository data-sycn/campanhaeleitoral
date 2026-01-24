import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Construction } from "lucide-react";

export function BudgetAllocations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Alocações por Categoria
        </CardTitle>
        <CardDescription>
          Distribua o orçamento entre as diferentes categorias de despesas
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-12">
        <Construction className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Em Desenvolvimento</h3>
        <p className="text-muted-foreground">
          Este módulo permitirá distribuir o orçamento por categorias como
          Publicidade, Transporte, Material, Eventos, etc.
        </p>
      </CardContent>
    </Card>
  );
}

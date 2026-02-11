import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

interface BudgetExecution {
  budget_id: string;
  year: number;
  total_planned: number;
  total_spent: number;
  saldo: number;
  percentual_executado: number;
}

interface BudgetExecutionChartProps {
  data: BudgetExecution[];
  loading: boolean;
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 });

export function BudgetExecutionChart({ data, loading }: BudgetExecutionChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>Orçamento vs Gasto Real</CardTitle></CardHeader>
        <CardContent><div className="h-80 bg-muted rounded animate-pulse" /></CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Orçamento vs Gasto Real</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <TrendingUp className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-sm">Nenhum orçamento cadastrado ainda.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    name: `${d.year}`,
    "Orçamento": Number(d.total_planned),
    "Gasto Real": Number(d.total_spent),
  }));

  return (
    <Card>
      <CardHeader><CardTitle>Orçamento vs Gasto Real</CardTitle></CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={(v) => `R$${v / 1000}k`} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="Orçamento" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Gasto Real" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

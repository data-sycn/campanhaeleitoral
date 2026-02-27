import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BudgetFormData } from "./useBudgetData";

interface BudgetFormProps {
  onSubmit: (data: BudgetFormData) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function BudgetForm({ onSubmit, onCancel, isSubmitting }: BudgetFormProps) {
  const [form, setForm] = useState<BudgetFormData>({
    title: "",
    total_planned: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(form);
    if (success) {
      setForm({ title: "", total_planned: "", notes: "" });
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Criar Novo Orçamento</CardTitle>
        <CardDescription>
          Defina um orçamento para a campanha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Orçamento Publicidade, Fundo Eleitoral..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_planned">Valor Total (R$)</Label>
              <Input
                id="total_planned"
                type="number"
                step="0.01"
                value={form.total_planned}
                onChange={(e) => setForm(prev => ({ ...prev, total_planned: e.target.value }))}
                placeholder="0,00"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observações sobre o orçamento..."
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} variant="campaign">
              {isSubmitting ? "Criando..." : "Criar Orçamento"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Budget } from "./useBudgetData";

interface BudgetCardProps {
  budget: Budget;
  onUpdate: (id: string, data: Partial<{ title: string; total_planned: number; notes: string | null; active: boolean }>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export function BudgetCard({ budget, onUpdate, onDelete }: BudgetCardProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: budget.title || "",
    total_planned: budget.total_planned.toString(),
    notes: budget.notes || "",
  });
  const [saving, setSaving] = useState(false);

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const displayName = budget.title || `Orçamento ${budget.year || ""}`;

  const handleSave = async () => {
    setSaving(true);
    const success = await onUpdate(budget.id, {
      title: form.title,
      total_planned: parseFloat(form.total_planned),
      notes: form.notes || null,
    });
    setSaving(false);
    if (success) setEditing(false);
  };

  const handleCancel = () => {
    setForm({
      title: budget.title || "",
      total_planned: budget.total_planned.toString(),
      notes: budget.notes || "",
    });
    setEditing(false);
  };

  if (editing) {
    return (
      <Card className="border-primary/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Editando Orçamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input type="number" step="0.01" value={form.total_planned} onChange={(e) => setForm((p) => ({ ...p, total_planned: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving} variant="campaign" size="sm" className="gap-1">
              <Check className="w-4 h-4" /> {saving ? "Salvando..." : "Salvar"}
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm" className="gap-1">
              <X className="w-4 h-4" /> Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{displayName}</span>
          <div className="flex items-center gap-2">
            {budget.active && (
              <Badge variant="default" className="bg-primary">Ativo</Badge>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(true)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir orçamento?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir "{displayName}"? Esta ação não pode ser desfeita e as alocações vinculadas também serão removidas.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(budget.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardTitle>
        <CardDescription>
          Criado em {new Date(budget.created_at).toLocaleDateString("pt-BR")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg text-primary">{formatCurrency(budget.total_planned)}</h4>
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

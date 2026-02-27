import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Banknote, Calendar, Pencil, Trash2, X, Check } from "lucide-react";

interface Revenue {
  id: string;
  date: string;
  source: string;
  description: string;
  amount: number;
  donor_name: string | null;
  donor_cpf_cnpj: string | null;
  notes: string | null;
  created_at: string;
}

const sources = [
  { value: "doacao_pf", label: "Doação Pessoa Física" },
  { value: "doacao_pj", label: "Doação Pessoa Jurídica" },
  { value: "fundo_partidario", label: "Fundo Partidário" },
  { value: "fundo_eleitoral", label: "Fundo Eleitoral" },
  { value: "recurso_proprio", label: "Recurso Próprio" },
  { value: "outros", label: "Outros" },
] as const;

export function BudgetRevenues() {
  const { user, campanhaId } = useAuth();
  const { toast } = useToast();
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ date: "", source: "", description: "", amount: "", donor_name: "", donor_cpf_cnpj: "", notes: "" });

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    source: "",
    description: "",
    amount: "",
    donor_name: "",
    donor_cpf_cnpj: "",
    notes: "",
  });

  useEffect(() => {
    fetchRevenues();
  }, [user, campanhaId]);

  const fetchRevenues = async () => {
    if (!user) return;
    try {
      let query = supabase
        .from("revenues" as any)
        .select("*")
        .order("date", { ascending: false });
      if (campanhaId) query = query.eq("campanha_id", campanhaId);
      const { data, error } = await query;
      if (error) {
        toast({ title: "Erro ao carregar receitas", description: error.message, variant: "destructive" });
      } else {
        setRevenues((data as any[]) || []);
      }
    } catch (error) {
      console.error("Error fetching revenues:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setCreating(true);
    try {
      if (!campanhaId) {
        toast({ title: "Erro", description: "Você precisa estar vinculado a uma campanha", variant: "destructive" });
        return;
      }
      const { error } = await supabase.from("revenues" as any).insert({
        campanha_id: campanhaId,
        date: form.date,
        source: form.source,
        description: form.description,
        amount: parseFloat(form.amount),
        donor_name: form.donor_name || null,
        donor_cpf_cnpj: form.donor_cpf_cnpj || null,
        notes: form.notes || null,
        created_by: user.id,
      } as any);
      if (error) {
        toast({ title: "Erro ao registrar receita", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Receita registrada!", description: "Receita registrada com sucesso." });
        setForm({ date: new Date().toISOString().split("T")[0], source: "", description: "", amount: "", donor_name: "", donor_cpf_cnpj: "", notes: "" });
        setShowForm(false);
        fetchRevenues();
      }
    } catch (error) {
      console.error("Error creating revenue:", error);
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (revenue: Revenue) => {
    setEditingId(revenue.id);
    setEditForm({
      date: revenue.date,
      source: revenue.source,
      description: revenue.description,
      amount: String(revenue.amount),
      donor_name: revenue.donor_name || "",
      donor_cpf_cnpj: revenue.donor_cpf_cnpj || "",
      notes: revenue.notes || "",
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      const { error } = await (supabase.from("revenues" as any) as any).update({
        date: editForm.date,
        source: editForm.source,
        description: editForm.description,
        amount: parseFloat(editForm.amount),
        donor_name: editForm.donor_name || null,
        donor_cpf_cnpj: editForm.donor_cpf_cnpj || null,
        notes: editForm.notes || null,
      }).eq("id", editingId);
      if (error) {
        toast({ title: "Erro ao atualizar receita", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Receita atualizada!" });
        setEditingId(null);
        fetchRevenues();
      }
    } catch (error) {
      console.error("Error updating revenue:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await (supabase.from("revenues" as any) as any).delete().eq("id", id);
      if (error) {
        toast({ title: "Erro ao excluir receita", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Receita excluída!" });
        fetchRevenues();
      }
    } catch (error) {
      console.error("Error deleting revenue:", error);
    }
  };

  const totalRevenues = revenues.reduce((sum, r) => sum + r.amount, 0);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="h-32 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Card className="flex-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <Banknote className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  R$ {totalRevenues.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
                <p className="text-muted-foreground">Total de receitas registradas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Button onClick={() => setShowForm(!showForm)} variant="campaign" className="gap-2 ml-4">
          <PlusCircle className="w-4 h-4" /> Nova Receita
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar Nova Receita</CardTitle>
            <CardDescription>Adicione uma nova receita da campanha</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rev-date">Data</Label>
                  <Input id="rev-date" type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rev-source">Fonte</Label>
                  <Select value={form.source} onValueChange={(value) => setForm((prev) => ({ ...prev, source: value }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione a fonte" /></SelectTrigger>
                    <SelectContent>
                      {sources.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rev-description">Descrição</Label>
                <Textarea id="rev-description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Descreva a receita..." required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rev-amount">Valor (R$)</Label>
                  <Input id="rev-amount" type="number" step="0.01" value={form.amount} onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))} placeholder="0,00" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rev-donor">Nome do Doador</Label>
                  <Input id="rev-donor" value={form.donor_name} onChange={(e) => setForm((prev) => ({ ...prev, donor_name: e.target.value }))} placeholder="Opcional" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rev-cpf">CPF/CNPJ do Doador</Label>
                  <Input id="rev-cpf" value={form.donor_cpf_cnpj} onChange={(e) => setForm((prev) => ({ ...prev, donor_cpf_cnpj: e.target.value }))} placeholder="Opcional" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rev-notes">Observações</Label>
                <Textarea id="rev-notes" value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Observações opcionais..." />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={creating} variant="campaign">{creating ? "Registrando..." : "Registrar Receita"}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {revenues.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Banknote className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma receita encontrada</h3>
              <p className="text-muted-foreground mb-4">Comece registrando as receitas da campanha</p>
              <Button onClick={() => setShowForm(true)} variant="campaign">Registrar Primeira Receita</Button>
            </CardContent>
          </Card>
        ) : (
          revenues.map((revenue) => (
            <Card key={revenue.id}>
              <CardContent className="p-6">
                {editingId === revenue.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Data</Label>
                        <Input type="date" value={editForm.date} onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Fonte</Label>
                        <Select value={editForm.source} onValueChange={(v) => setEditForm(prev => ({ ...prev, source: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {sources.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Textarea value={editForm.description} onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Valor (R$)</Label>
                        <Input type="number" step="0.01" value={editForm.amount} onChange={(e) => setEditForm(prev => ({ ...prev, amount: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Doador</Label>
                        <Input value={editForm.donor_name} onChange={(e) => setEditForm(prev => ({ ...prev, donor_name: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>CPF/CNPJ</Label>
                        <Input value={editForm.donor_cpf_cnpj} onChange={(e) => setEditForm(prev => ({ ...prev, donor_cpf_cnpj: e.target.value }))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Observações</Label>
                      <Textarea value={editForm.notes} onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))} />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="campaign" onClick={handleUpdate} className="gap-1"><Check className="w-4 h-4" /> Salvar</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="gap-1"><X className="w-4 h-4" /> Cancelar</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{new Date(revenue.date).toLocaleDateString("pt-BR")}</span>
                        <span className="text-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded">
                          {sources.find((s) => s.value === revenue.source)?.label || revenue.source}
                        </span>
                      </div>
                      <h4 className="font-semibold mb-1">{revenue.description}</h4>
                      {revenue.donor_name && <p className="text-sm text-muted-foreground">Doador: {revenue.donor_name}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        + R$ {revenue.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <Button size="icon" variant="ghost" onClick={() => startEdit(revenue)}><Pencil className="w-4 h-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir receita?</AlertDialogTitle>
                            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(revenue.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

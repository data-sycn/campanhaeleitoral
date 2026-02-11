import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Receipt, Calendar } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  payment_method: string;
  created_at: string;
}

const categories = [
  { value: 'publicidade', label: 'Publicidade' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'alimentacao', label: 'Alimentação' },
  { value: 'material', label: 'Material' },
  { value: 'eventos', label: 'Eventos' },
  { value: 'pessoal', label: 'Pessoal' },
  { value: 'outros', label: 'Outros' }
] as const;

const paymentMethods = [
  { value: 'pix', label: 'PIX' },
  { value: 'cartao', label: 'Cartão' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'transferencia', label: 'Transferência' },
  { value: 'boleto', label: 'Boleto' }
] as const;

export function BudgetExpenses() {
  const { user, campanhaId, profile } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: "",
    description: "",
    amount: "",
    payment_method: ""
  });

  useEffect(() => {
    fetchExpenses();
  }, [user, campanhaId]);

  const fetchExpenses = async () => {
    if (!user) return;
    try {
      let query = supabase.from('expenses').select('*').order('date', { ascending: false });
      if (campanhaId) query = query.eq('campanha_id', campanhaId);
      const { data, error } = await query;
      if (error) {
        toast({ title: "Erro ao carregar despesas", description: error.message, variant: "destructive" });
      } else {
        setExpenses(data || []);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
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
        toast({ title: "Erro", description: "Você precisa estar vinculado a uma campanha para registrar despesas", variant: "destructive" });
        return;
      }
      const { error } = await supabase.from('expenses').insert({
        candidate_id: profile?.candidate_id || undefined,
        campanha_id: campanhaId,
        date: form.date,
        category: form.category as Database["public"]["Enums"]["expense_category"],
        description: form.description,
        amount: parseFloat(form.amount),
        payment_method: form.payment_method as Database["public"]["Enums"]["payment_method"],
        created_by: user.id
      });
      if (error) {
        toast({ title: "Erro ao registrar despesa", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Despesa registrada!", description: "Despesa registrada com sucesso." });
        setForm({ date: new Date().toISOString().split('T')[0], category: "", description: "", amount: "", payment_method: "" });
        setShowForm(false);
        fetchExpenses();
      }
    } catch (error) {
      console.error('Error creating expense:', error);
    } finally {
      setCreating(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

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
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
                <p className="text-muted-foreground">Total de despesas registradas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Button onClick={() => setShowForm(!showForm)} variant="campaign" className="gap-2 ml-4">
          <PlusCircle className="w-4 h-4" /> Nova Despesa
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar Nova Despesa</CardTitle>
            <CardDescription>Adicione uma nova despesa da campanha</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exp-date">Data</Label>
                  <Input id="exp-date" type="date" value={form.date} onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-category">Categoria</Label>
                  <Select value={form.category} onValueChange={(value) => setForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-description">Descrição</Label>
                <Textarea id="exp-description" value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Descreva a despesa..." required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exp-amount">Valor (R$)</Label>
                  <Input id="exp-amount" type="number" step="0.01" value={form.amount} onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))} placeholder="0,00" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-payment">Forma de Pagamento</Label>
                  <Select value={form.payment_method} onValueChange={(value) => setForm(prev => ({ ...prev, payment_method: value }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione o método" /></SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={creating} variant="campaign">{creating ? "Registrando..." : "Registrar Despesa"}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {expenses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Receipt className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma despesa encontrada</h3>
              <p className="text-muted-foreground mb-4">Comece registrando suas primeiras despesas de campanha</p>
              <Button onClick={() => setShowForm(true)} variant="campaign">Registrar Primeira Despesa</Button>
            </CardContent>
          </Card>
        ) : (
          expenses.map((expense) => (
            <Card key={expense.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{new Date(expense.date).toLocaleDateString('pt-BR')}</span>
                      <span className="text-sm bg-muted px-2 py-1 rounded">{categories.find(c => c.value === expense.category)?.label}</span>
                    </div>
                    <h4 className="font-semibold mb-1">{expense.description}</h4>
                    <p className="text-sm text-muted-foreground">{paymentMethods.find(p => p.value === expense.payment_method)?.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

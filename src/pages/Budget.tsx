import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, DollarSign } from "lucide-react";

interface Budget {
  id: string;
  year: number;
  total_planned: number;
  notes?: string;
  active: boolean;
  created_at: string;
}

const Budget = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    total_planned: "",
    notes: ""
  });

  useEffect(() => {
    fetchBudgets();
  }, [user]);

  const fetchBudgets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('year', { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar orçamentos",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setBudgets(data || []);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setCreating(true);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('candidate_id')
        .eq('id', user.id)
        .single();

      if (!profile?.candidate_id) {
        toast({
          title: "Erro",
          description: "Você precisa estar vinculado a um candidato para criar orçamentos",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('budgets')
        .insert({
          candidate_id: profile.candidate_id,
          year: form.year,
          total_planned: parseFloat(form.total_planned),
          notes: form.notes || null,
          active: true
        });

      if (error) {
        toast({
          title: "Erro ao criar orçamento",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Orçamento criado!",
          description: "Orçamento criado com sucesso."
        });
        setForm({
          year: new Date().getFullYear(),
          total_planned: "",
          notes: ""
        });
        setShowForm(false);
        fetchBudgets();
      }
    } catch (error) {
      console.error('Error creating budget:', error);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orçamento</h1>
          <p className="text-muted-foreground">Gerencie o orçamento da campanha</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          variant="campaign"
          className="gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Novo Orçamento
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Criar Novo Orçamento</CardTitle>
            <CardDescription>
              Defina o orçamento total para o ano da campanha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Ano</Label>
                  <Input
                    id="year"
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    min="2020"
                    max="2030"
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
                <Button type="submit" disabled={creating} variant="campaign">
                  {creating ? "Criando..." : "Criar Orçamento"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {budgets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <DollarSign className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum orçamento encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando seu primeiro orçamento de campanha
              </p>
              <Button onClick={() => setShowForm(true)} variant="campaign">
                Criar Primeiro Orçamento
              </Button>
            </CardContent>
          </Card>
        ) : (
          budgets.map((budget) => (
            <Card key={budget.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Orçamento {budget.year}</span>
                  {budget.active && (
                    <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded">
                      Ativo
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  Criado em {new Date(budget.created_at).toLocaleDateString('pt-BR')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">
                      R$ {budget.total_planned.toLocaleString('pt-BR', { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2 
                      })}
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
          ))
        )}
      </div>
    </div>
  );
};

export default Budget;
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Package, Edit } from "lucide-react";

interface MaterialItem {
  id: string;
  tipo: string;
  descricao: string | null;
  cidade: string;
  quantidade_enviada: number;
  quantidade_reportada: number;
  created_at: string;
}

const TIPOS_MATERIAL = [
  { value: "santinhos", label: "Santinhos" },
  { value: "adesivos", label: "Adesivos" },
  { value: "bandeiras", label: "Bandeiras" },
  { value: "camisetas", label: "Camisetas" },
  { value: "outros", label: "Outros" },
];

export const MaterialInventory = () => {
  const { user, campanhaId, isMaster } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ tipo: "", descricao: "", cidade: "", quantidade_enviada: "" });

  const [reportDialog, setReportDialog] = useState<{ open: boolean; item: MaterialItem | null }>({ open: false, item: null });
  const [reportAmount, setReportAmount] = useState("");
  const [savingReport, setSavingReport] = useState(false);

  const fetchItems = useCallback(async () => {
    if (!user || (!campanhaId && !isMaster)) { setLoading(false); return; }
    let query = supabase
      .from("material_inventory" as any)
      .select("*")
      .order("created_at", { ascending: false }) as any;
    if (campanhaId) query = query.eq("campanha_id", campanhaId);
    const { data, error } = await query;

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setItems((data as MaterialItem[]) || []);
    }
    setLoading(false);
  }, [user, campanhaId, isMaster]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !campanhaId) return;
    setCreating(true);

    const { error } = await (supabase.from("material_inventory" as any) as any).insert({
      campanha_id: campanhaId,
      created_by: user.id,
      tipo: form.tipo,
      descricao: form.descricao || null,
      cidade: form.cidade,
      quantidade_enviada: parseInt(form.quantidade_enviada),
    });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Material registrado!" });
      setForm({ tipo: "", descricao: "", cidade: "", quantidade_enviada: "" });
      setShowForm(false);
      fetchItems();
    }
    setCreating(false);
  };

  const handleSaveReport = async () => {
    if (!reportDialog.item) return;
    setSavingReport(true);
    const { error } = await (supabase
      .from("material_inventory" as any)
      .update({ quantidade_reportada: parseInt(reportAmount) })
      .eq("id", reportDialog.item.id) as any);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Quantidade reportada atualizada!" });
      setReportDialog({ open: false, item: null });
      fetchItems();
    }
    setSavingReport(false);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-48" />
        <div className="h-64 bg-muted rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <PlusCircle className="w-4 h-4" /> Registrar Envio
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar Envio de Material</CardTitle>
            <CardDescription>Informe o material enviado para uma cidade</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo *</Label>
                  <Select value={form.tipo} onValueChange={(v) => setForm((p) => ({ ...p, tipo: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                    <SelectContent>
                      {TIPOS_MATERIAL.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cidade *</Label>
                  <Input value={form.cidade} onChange={(e) => setForm((p) => ({ ...p, cidade: e.target.value }))} placeholder="Nome da cidade" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea value={form.descricao} onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))} placeholder="Detalhes do material..." />
              </div>
              <div className="space-y-2 max-w-xs">
                <Label>Quantidade Enviada *</Label>
                <Input type="number" value={form.quantidade_enviada} onChange={(e) => setForm((p) => ({ ...p, quantidade_enviada: e.target.value }))} required />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={creating || !form.tipo || !form.cidade || !form.quantidade_enviada}>
                  {creating ? "Registrando..." : "Registrar"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum material registrado</h3>
              <p className="text-muted-foreground mb-4">Registre o primeiro envio de material</p>
              <Button onClick={() => setShowForm(true)}>Registrar Envio</Button>
            </CardContent>
          </Card>
        ) : (
          items.map((item) => {
            const pct = item.quantidade_enviada > 0
              ? Math.round((item.quantidade_reportada / item.quantidade_enviada) * 100)
              : 0;
            const tipoLabel = TIPOS_MATERIAL.find((t) => t.value === item.tipo)?.label || item.tipo;
            return (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{tipoLabel}</Badge>
                        <span className="text-sm text-muted-foreground">📍 {item.cidade}</span>
                      </div>
                      {item.descricao && <p className="text-sm">{item.descricao}</p>}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Reportado: {item.quantidade_reportada} / {item.quantidade_enviada}</span>
                          <span className="font-medium">{pct}%</span>
                        </div>
                        <Progress value={pct} className="h-2" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setReportDialog({ open: true, item });
                        setReportAmount(String(item.quantidade_reportada || 0));
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" /> Reportar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Dialog open={reportDialog.open} onOpenChange={(open) => !open && setReportDialog({ open: false, item: null })}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reportar Distribuição</DialogTitle>
            <DialogDescription>
              {reportDialog.item && `Total enviado: ${reportDialog.item.quantidade_enviada}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Quantidade Distribuída</Label>
              <Input type="number" value={reportAmount} onChange={(e) => setReportAmount(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialog({ open: false, item: null })}>Cancelar</Button>
            <Button onClick={handleSaveReport} disabled={savingReport}>
              {savingReport ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2, Trash2, Pencil, Building2 } from "lucide-react";

interface CampanhaForm {
  nome: string;
  partido: string;
  cargo: string;
  numero_candidato: string;
  municipio: string;
  uf: string;
  cor_primaria: string;
}

const emptyForm: CampanhaForm = {
  nome: "",
  partido: "",
  cargo: "",
  numero_candidato: "",
  municipio: "",
  uf: "",
  cor_primaria: "#3B82F6",
};

export function AdminCampanhas() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CampanhaForm>(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: campanhas, isLoading } = useQuery({
    queryKey: ["admin-campanhas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campanhas")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (data: CampanhaForm & { id?: string }) => {
      const { id, ...rest } = data;
      if (id) {
        const { error } = await supabase.from("campanhas").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("campanhas").insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-campanhas"] });
      toast({ title: editingId ? "Campanha atualizada!" : "Campanha criada!" });
      closeDialog();
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("campanhas")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-campanhas"] });
      toast({ title: "Campanha removida!" });
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const openEdit = (c: any) => {
    setEditingId(c.id);
    setForm({
      nome: c.nome || "",
      partido: c.partido || "",
      cargo: c.cargo || "",
      numero_candidato: c.numero_candidato || "",
      municipio: c.municipio || "",
      uf: c.uf || "",
      cor_primaria: c.cor_primaria || "#3B82F6",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.nome.trim()) {
      toast({ title: "Nome é obrigatório", variant: "destructive" });
      return;
    }
    upsertMutation.mutate({ ...form, ...(editingId ? { id: editingId } : {}) });
  };

  const updateField = (field: keyof CampanhaForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Campanhas
          </CardTitle>
          <CardDescription>Gerencie as campanhas eleitorais cadastradas</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); else setIsDialogOpen(true); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Campanha
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Campanha" : "Nova Campanha"}</DialogTitle>
              <DialogDescription>Preencha os dados da campanha eleitoral</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome *</label>
                  <Input value={form.nome} onChange={(e) => updateField("nome", e.target.value)} placeholder="Nome do candidato" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Partido</label>
                  <Input value={form.partido} onChange={(e) => updateField("partido", e.target.value)} placeholder="Ex: PL, PT" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cargo</label>
                  <Input value={form.cargo} onChange={(e) => updateField("cargo", e.target.value)} placeholder="Ex: Prefeito, Vereador" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Número</label>
                  <Input value={form.numero_candidato} onChange={(e) => updateField("numero_candidato", e.target.value)} placeholder="Ex: 45" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Município</label>
                  <Input value={form.municipio} onChange={(e) => updateField("municipio", e.target.value)} placeholder="Ex: São Paulo" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">UF</label>
                  <Input value={form.uf} onChange={(e) => updateField("uf", e.target.value)} placeholder="Ex: SP" maxLength={2} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cor primária</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={form.cor_primaria} onChange={(e) => updateField("cor_primaria", e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
                  <Input value={form.cor_primaria} onChange={(e) => updateField("cor_primaria", e.target.value)} className="flex-1" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={upsertMutation.isPending}>
                {upsertMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingId ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Partido</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Nº</TableHead>
              <TableHead>Município/UF</TableHead>
              <TableHead>Cor</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campanhas?.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.nome}</TableCell>
                <TableCell>{c.partido || "—"}</TableCell>
                <TableCell>{c.cargo || "—"}</TableCell>
                <TableCell>{c.numero_candidato || "—"}</TableCell>
                <TableCell>{[c.municipio, c.uf].filter(Boolean).join("/") || "—"}</TableCell>
                <TableCell>
                  <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: c.cor_primaria || "#3B82F6" }} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Tem certeza que deseja remover esta campanha?")) {
                          deleteMutation.mutate(c.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {campanhas?.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Nenhuma campanha cadastrada.</p>
        )}
      </CardContent>
    </Card>
  );
}

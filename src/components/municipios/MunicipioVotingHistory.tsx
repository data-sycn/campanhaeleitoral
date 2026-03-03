import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  municipioId: string;
  municipioNome: string;
  campanhaId: string;
  open: boolean;
  onClose: () => void;
}

interface VotoForm {
  eleicao_ano: string;
  cargo: string;
  votacao: string;
}

const emptyVoto: VotoForm = { eleicao_ano: "", cargo: "", votacao: "" };

export function MunicipioVotingHistory({ municipioId, municipioNome, campanhaId, open, onClose }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<VotoForm>(emptyVoto);
  const [showForm, setShowForm] = useState(false);

  const { data: historico, isLoading } = useQuery({
    queryKey: ["municipio-historico", municipioId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("municipio_historico_votacao")
        .select("*")
        .eq("municipio_id", municipioId)
        .order("eleicao_ano", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("municipio_historico_votacao").insert({
        municipio_id: municipioId,
        campanha_id: campanhaId,
        eleicao_ano: parseInt(form.eleicao_ano),
        cargo: form.cargo.trim(),
        votacao: parseInt(form.votacao),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["municipio-historico", municipioId] });
      toast({ title: "Registro adicionado!" });
      setForm(emptyVoto);
      setShowForm(false);
    },
    onError: (err: any) => toast({ title: "Erro", description: err?.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("municipio_historico_votacao").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["municipio-historico", municipioId] });
      toast({ title: "Registro removido!" });
    },
    onError: () => toast({ title: "Erro ao remover", variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Histórico de Votação — {municipioNome}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add form */}
          {showForm ? (
            <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Eleição / Ano *</Label>
                  <Input type="number" placeholder="2024" value={form.eleicao_ano}
                    onChange={e => setForm(f => ({ ...f, eleicao_ano: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Cargo *</Label>
                  <Input placeholder="Prefeito" value={form.cargo}
                    onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Votação *</Label>
                  <Input type="number" placeholder="12500" value={form.votacao}
                    onChange={e => setForm(f => ({ ...f, votacao: e.target.value }))} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => { setShowForm(false); setForm(emptyVoto); }}>
                  Cancelar
                </Button>
                <Button size="sm" disabled={addMutation.isPending || !form.eleicao_ano || !form.cargo || !form.votacao}
                  onClick={() => addMutation.mutate()}>
                  {addMutation.isPending ? "Salvando..." : "Adicionar"}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" /> Adicionar Registro
            </Button>
          )}

          {/* History table */}
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2].map(i => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : !historico?.length ? (
            <p className="text-sm text-muted-foreground text-center py-6">Nenhum registro de votação.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ano</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead className="text-right">Votação</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {historico.map(h => (
                  <TableRow key={h.id}>
                    <TableCell className="font-medium">{h.eleicao_ano}</TableCell>
                    <TableCell>{h.cargo}</TableCell>
                    <TableCell className="text-right">{h.votacao.toLocaleString("pt-BR")}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => {
                        if (confirm("Remover este registro?")) deleteMutation.mutate(h.id);
                      }}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

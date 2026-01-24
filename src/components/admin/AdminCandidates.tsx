import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Building2, Plus, Loader2, Pencil, Trash2 } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  party: string | null;
  position: string | null;
  created_at: string;
  updated_at: string;
}

export function AdminCandidates() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [formData, setFormData] = useState({ name: "", party: "", position: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: candidates, isLoading } = useQuery({
    queryKey: ['admin-candidates-full'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Candidate[];
    }
  });

  const createCandidateMutation = useMutation({
    mutationFn: async (data: { name: string; party: string; position: string }) => {
      const { error } = await supabase
        .from('candidates')
        .insert({
          name: data.name,
          party: data.party || null,
          position: data.position || null
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-candidates-full'] });
      queryClient.invalidateQueries({ queryKey: ['admin-candidates'] });
      toast({ title: "Candidato criado com sucesso" });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar candidato",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateCandidateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string; party: string; position: string } }) => {
      const { error } = await supabase
        .from('candidates')
        .update({
          name: data.name,
          party: data.party || null,
          position: data.position || null
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-candidates-full'] });
      queryClient.invalidateQueries({ queryKey: ['admin-candidates'] });
      toast({ title: "Candidato atualizado com sucesso" });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar candidato",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteCandidateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-candidates-full'] });
      queryClient.invalidateQueries({ queryKey: ['admin-candidates'] });
      toast({ title: "Candidato removido com sucesso" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover candidato",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleOpenDialog = (candidate?: Candidate) => {
    if (candidate) {
      setEditingCandidate(candidate);
      setFormData({
        name: candidate.name,
        party: candidate.party || "",
        position: candidate.position || ""
      });
    } else {
      setEditingCandidate(null);
      setFormData({ name: "", party: "", position: "" });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCandidate(null);
    setFormData({ name: "", party: "", position: "" });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({ title: "Nome é obrigatório", variant: "destructive" });
      return;
    }

    if (editingCandidate) {
      updateCandidateMutation.mutate({ id: editingCandidate.id, data: formData });
    } else {
      createCandidateMutation.mutate(formData);
    }
  };

  const isPending = createCandidateMutation.isPending || updateCandidateMutation.isPending;

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
            Candidatos (Unidades de Controle)
          </CardTitle>
          <CardDescription>
            Gerencie os candidatos que são as unidades centrais de controle do sistema
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => open ? handleOpenDialog() : handleCloseDialog()}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Candidato
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCandidate ? "Editar Candidato" : "Criar Candidato"}
              </DialogTitle>
              <DialogDescription>
                {editingCandidate 
                  ? "Atualize os dados do candidato" 
                  : "Preencha os dados para criar uma nova unidade de controle"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  placeholder="Nome do candidato"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="party">Partido</Label>
                <Input
                  id="party"
                  placeholder="Ex: PT, PSDB, MDB..."
                  value={formData.party}
                  onChange={(e) => setFormData(prev => ({ ...prev, party: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Cargo</Label>
                <Input
                  id="position"
                  placeholder="Ex: Prefeito, Vereador, Deputado..."
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingCandidate ? "Salvar" : "Criar"}
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
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[120px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates?.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell className="font-medium">{candidate.name}</TableCell>
                <TableCell>{candidate.party || "-"}</TableCell>
                <TableCell>{candidate.position || "-"}</TableCell>
                <TableCell>
                  {new Date(candidate.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleOpenDialog(candidate)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja remover este candidato?')) {
                          deleteCandidateMutation.mutate(candidate.id);
                        }
                      }}
                      disabled={deleteCandidateMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {candidates?.length === 0 && (
          <div className="text-center py-8">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhum candidato cadastrado. Crie o primeiro para começar.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

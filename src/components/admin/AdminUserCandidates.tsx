import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2, Trash2, Building2 } from "lucide-react";

interface UserCandidate {
  id: string;
  user_id: string;
  candidate_id: string;
  is_default: boolean;
  created_at: string;
  user_name?: string;
  candidate_name?: string;
}

export function AdminUserCandidates() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar associações existentes
  const { data: associations, isLoading } = useQuery({
    queryKey: ['admin-user-candidates'],
    queryFn: async () => {
      const { data: userCandidates, error } = await supabase
        .from('user_candidates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Buscar nomes dos usuários e candidatos
      const { data: profiles } = await supabase.from('profiles').select('id, name');
      const { data: candidates } = await supabase.from('candidates').select('id, name');

      const profilesMap = new Map(profiles?.map(p => [p.id, p.name]) || []);
      const candidatesMap = new Map(candidates?.map(c => [c.id, c.name]) || []);

      return userCandidates?.map(uc => ({
        ...uc,
        user_name: profilesMap.get(uc.user_id) || 'Usuário desconhecido',
        candidate_name: candidatesMap.get(uc.candidate_id) || 'Candidato desconhecido'
      })) as UserCandidate[];
    }
  });

  // Buscar usuários disponíveis
  const { data: users } = useQuery({
    queryKey: ['admin-profiles-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  // Buscar candidatos disponíveis
  const { data: candidates } = useQuery({
    queryKey: ['admin-candidates-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('candidates')
        .select('id, name, party')
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  // Criar associação
  const createMutation = useMutation({
    mutationFn: async ({ userId, candidateId }: { userId: string; candidateId: string }) => {
      const { error } = await supabase
        .from('user_candidates')
        .insert({ user_id: userId, candidate_id: candidateId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-candidates'] });
      toast({ title: "Associação criada com sucesso!" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar associação",
        description: error.message.includes('duplicate') 
          ? "Esta associação já existe." 
          : error.message,
        variant: "destructive"
      });
    }
  });

  // Deletar associação
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_candidates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-candidates'] });
      toast({ title: "Associação removida com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover associação",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setSelectedUserId("");
    setSelectedCandidateId("");
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
            Acesso a Candidatos
          </CardTitle>
          <CardDescription>
            Gerencie quais candidatos cada usuário pode acessar
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Associação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Associar Usuário a Candidato</DialogTitle>
              <DialogDescription>
                Selecione o usuário e o candidato para criar a associação
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Usuário</label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Candidato</label>
                <Select value={selectedCandidateId} onValueChange={setSelectedCandidateId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um candidato" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates?.map((candidate) => (
                      <SelectItem key={candidate.id} value={candidate.id}>
                        {candidate.name} {candidate.party && `(${candidate.party})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={() => createMutation.mutate({
                  userId: selectedUserId,
                  candidateId: selectedCandidateId
                })}
                disabled={!selectedUserId || !selectedCandidateId || createMutation.isPending}
              >
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Criar Associação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Candidato</TableHead>
              <TableHead>Padrão</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {associations?.map((assoc) => (
              <TableRow key={assoc.id}>
                <TableCell className="font-medium">{assoc.user_name}</TableCell>
                <TableCell>{assoc.candidate_name}</TableCell>
                <TableCell>
                  {assoc.is_default && <Badge variant="secondary">Padrão</Badge>}
                </TableCell>
                <TableCell>
                  {new Date(assoc.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      if (confirm('Tem certeza que deseja remover esta associação?')) {
                        deleteMutation.mutate(assoc.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {associations?.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma associação encontrada. Crie uma para permitir que usuários acessem candidatos.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Loader2, Trash2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database['public']['Enums']['app_role'];

interface UserWithRoles {
  id: string;
  name: string;
  candidate_id: string | null;
  created_at: string;
  roles: AppRole[];
  candidateName?: string;
}

export function AdminUsers() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState<AppRole>("supporter");
  const [newUserCandidate, setNewUserCandidate] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      const { data: candidates, error: candidatesError } = await supabase
        .from('candidates')
        .select('id, name');

      if (candidatesError) throw candidatesError;

      const candidatesMap = new Map(candidates?.map(c => [c.id, c.name]) || []);

      const usersWithRoles: UserWithRoles[] = profiles?.map(profile => ({
        ...profile,
        roles: roles?.filter(r => r.user_id === profile.id).map(r => r.role) || [],
        candidateName: profile.candidate_id ? candidatesMap.get(profile.candidate_id) : undefined
      })) || [];

      return usersWithRoles;
    }
  });

  const { data: candidates } = useQuery({
    queryKey: ['admin-candidates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: { email: string; name: string; role: AppRole; candidateId?: string }) => {
      // Note: Creating users via admin requires Supabase Admin API
      // For now, we'll just show a toast with instructions
      toast({
        title: "Instruções",
        description: "Para criar novos usuários, use o painel do Supabase ou peça ao usuário para se cadastrar.",
      });
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsDialogOpen(false);
      resetForm();
    }
  });

  const updateUserCandidateMutation = useMutation({
    mutationFn: async ({ userId, candidateId }: { userId: string; candidateId: string | null }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ candidate_id: candidateId })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: "Candidato atualizado com sucesso" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar candidato",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setNewUserEmail("");
    setNewUserName("");
    setNewUserRole("supporter");
    setNewUserCandidate("");
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'master': return 'destructive';
      case 'admin': return 'destructive';
      case 'coordinator': return 'default';
      case 'candidate': return 'default';
      default: return 'secondary';
    }
  };

  const getRoleLabel = (role: AppRole) => {
    switch (role) {
      case 'master': return 'Master';
      case 'admin': return 'Administrador';
      case 'coordinator': return 'Coordenador';
      case 'candidate': return 'Candidato';
      default: return 'Apoiador';
    }
  };

  if (loadingUsers) {
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
          <CardTitle>Usuários</CardTitle>
          <CardDescription>Gerencie os usuários do sistema</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="w-4 h-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo usuário
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@email.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Nome completo"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Select value={newUserRole} onValueChange={(v) => setNewUserRole(v as AppRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supporter">Apoiador</SelectItem>
                    <SelectItem value="coordinator">Coordenador</SelectItem>
                    <SelectItem value="candidate">Candidato</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="master">Master</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="candidate">Vincular a Candidato</Label>
                <Select value={newUserCandidate} onValueChange={setNewUserCandidate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um candidato" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
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
                onClick={() => createUserMutation.mutate({
                  email: newUserEmail,
                  name: newUserName,
                  role: newUserRole,
                  candidateId: newUserCandidate || undefined
                })}
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Criar Usuário
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
              <TableHead>Funções</TableHead>
              <TableHead>Candidato Vinculado</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {user.roles.map((role) => (
                      <Badge key={role} variant={getRoleBadgeVariant(role)}>
                        {getRoleLabel(role)}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={user.candidate_id || "none"}
                    onValueChange={(value) => 
                      updateUserCandidateMutation.mutate({
                        userId: user.id,
                        candidateId: value === "none" ? null : value
                      })
                    }
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Sem candidato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem candidato</SelectItem>
                      {candidates?.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" disabled>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users?.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Nenhum usuário encontrado
          </p>
        )}
      </CardContent>
    </Card>
  );
}

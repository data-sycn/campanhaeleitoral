import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Link2, Save, Crown } from "lucide-react";

export function AdminUserCampanhas() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [pendingChanges, setPendingChanges] = useState<Record<string, string | null>>({});

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ["admin-user-campanhas"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, name, campanha_id")
        .order("name");
      if (error) throw error;

      // Fetch roles to identify master users
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role");

      const rolesMap = new Map<string, string[]>();
      roles?.forEach((r) => {
        const existing = rolesMap.get(r.user_id) || [];
        existing.push(r.role);
        rolesMap.set(r.user_id, existing);
      });

      return profiles?.map((p) => ({
        ...p,
        roles: rolesMap.get(p.id) || [],
        isMaster: rolesMap.get(p.id)?.includes("master") || false,
      }));
    },
  });

  const { data: campanhas } = useQuery({
    queryKey: ["admin-campanhas-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campanhas")
        .select("id, nome, partido")
        .is("deleted_at", null)
        .order("nome");
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ userId, campanhaId }: { userId: string; campanhaId: string | null }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ campanha_id: campanhaId })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-campanhas"] });
      toast({ title: "Campanha atualizada!" });
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const campanhasMap = new Map(campanhas?.map((c) => [c.id, c]) || []);

  const handleChange = (userId: string, value: string) => {
    const campanhaId = value === "__none__" ? null : value;
    setPendingChanges((prev) => ({ ...prev, [userId]: campanhaId }));
  };

  const handleSave = (userId: string) => {
    const campanhaId = pendingChanges[userId];
    if (campanhaId === undefined) return;
    updateMutation.mutate({ userId, campanhaId });
    setPendingChanges((prev) => {
      const next = { ...prev };
      delete next[userId];
      return next;
    });
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="w-5 h-5" />
          Acesso a Campanhas
        </CardTitle>
        <CardDescription>Defina a campanha associada a cada usuário</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Campanha atual</TableHead>
              <TableHead>Alterar para</TableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => {
              const current = user.campanha_id ? campanhasMap.get(user.campanha_id) : null;
              const hasPending = pendingChanges[user.id] !== undefined;
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {user.name}
                      {user.isMaster && (
                        <Badge variant="outline" className="gap-1 text-xs">
                          <Crown className="w-3 h-3" />
                          Master
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.isMaster ? (
                      <span className="text-muted-foreground text-sm italic">Acesso global</span>
                    ) : current ? (
                      <Badge variant="secondary">
                        {current.nome} {current.partido && `(${current.partido})`}
                      </Badge>
                    ) : (
                      <span className="text-destructive text-sm font-medium">Sem vínculo</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.isMaster ? (
                      <span className="text-muted-foreground text-sm">Não necessário</span>
                    ) : (
                      <Select
                        value={pendingChanges[user.id] ?? user.campanha_id ?? "__none__"}
                        onValueChange={(v) => handleChange(user.id, v)}
                      >
                        <SelectTrigger className="w-[220px]">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">Nenhuma</SelectItem>
                          {campanhas?.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.nome} {c.partido && `(${c.partido})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>
                    {hasPending && !user.isMaster && (
                      <Button
                        size="sm"
                        onClick={() => handleSave(user.id)}
                        disabled={updateMutation.isPending}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {users?.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Nenhum usuário encontrado.</p>
        )}
      </CardContent>
    </Card>
  );
}

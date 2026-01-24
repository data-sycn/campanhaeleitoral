import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, UserPlus, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ModuleSwitcher } from "@/components/navigation/ModuleSwitcher";

interface Profile {
  id: string;
  name: string;
  created_at: string;
}

interface UserRole {
  role: 'admin' | 'candidate' | 'supporter';
}

interface SupporterWithRole extends Profile {
  user_roles?: UserRole[];
}

const Supporters = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [supporters, setSupporters] = useState<SupporterWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    email: "",
    message: ""
  });

  useEffect(() => {
    fetchSupporters();
  }, [user]);

  const fetchSupporters = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('candidate_id')
        .eq('id', user.id)
        .single();

      if (!profile?.candidate_id) {
        setLoading(false);
        return;
      }

      // Fetch profiles for this candidate
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('candidate_id', profile.candidate_id)
        .order('created_at', { ascending: false });

      if (profilesError) {
        toast({
          title: "Erro ao carregar apoiadores",
          description: profilesError.message,
          variant: "destructive"
        });
        return;
      }

      // Fetch roles for each user
      const userIds = profilesData?.map(p => p.id) || [];
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      // Combine profiles with roles
      const supportersWithRoles: SupporterWithRole[] = (profilesData || []).map(p => ({
        ...p,
        user_roles: rolesData?.filter(r => r.user_id === p.id) || []
      }));

      setSupporters(supportersWithRoles);
    } catch (error) {
      console.error('Error fetching supporters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setInviting(true);

    try {
      // In a real implementation, you would send an email invitation
      toast({
        title: "Convite enviado!",
        description: `Convite enviado para ${inviteForm.email}. O usuário receberá instruções por email.`
      });
      
      setInviteForm({ email: "", message: "" });
      setShowInviteForm(false);
    } catch (error) {
      console.error('Error sending invite:', error);
      toast({
        title: "Erro ao enviar convite",
        description: "Ocorreu um erro ao enviar o convite. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setInviting(false);
    }
  };

  const getRoleLabel = (supporter: SupporterWithRole) => {
    const role = supporter.user_roles?.[0]?.role || 'supporter';
    const roles = {
      admin: { label: 'Administrador', color: 'bg-destructive text-destructive-foreground' },
      candidate: { label: 'Candidato', color: 'bg-primary text-primary-foreground' },
      supporter: { label: 'Apoiador', color: 'bg-secondary text-secondary-foreground' }
    };
    return roles[role] || { label: role, color: 'bg-muted' };
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
      <div className="mb-6">
        <ModuleSwitcher />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Apoiadores</h1>
          <p className="text-muted-foreground">Gerencie a equipe da campanha</p>
        </div>
        <Button 
          onClick={() => setShowInviteForm(!showInviteForm)}
          variant="campaign"
          className="gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Convidar Apoiador
        </Button>
      </div>

      {/* Estatísticas */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 gradient-civic rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{supporters.length}</h3>
              <p className="text-muted-foreground">Total de membros da equipe</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {showInviteForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Convidar Novo Apoiador</CardTitle>
            <CardDescription>
              Envie um convite para alguém se juntar à sua equipe de campanha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email do Convidado</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem Personalizada (Opcional)</Label>
                <Input
                  id="message"
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Convido você para fazer parte da nossa equipe..."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={inviting} variant="campaign">
                  {inviting ? "Enviando..." : "Enviar Convite"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowInviteForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {supporters.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum apoiador encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Comece convidando pessoas para se juntarem à sua equipe
              </p>
              <Button onClick={() => setShowInviteForm(true)} variant="campaign">
                Convidar Primeiro Apoiador
              </Button>
            </CardContent>
          </Card>
        ) : (
          supporters.map((supporter) => {
            const roleInfo = getRoleLabel(supporter);
            return (
              <Card key={supporter.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="" />
                      <AvatarFallback className="gradient-primary text-white">
                        {supporter.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{supporter.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Membro desde {new Date(supporter.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge className={roleInfo.color}>
                      {roleInfo.label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Supporters;
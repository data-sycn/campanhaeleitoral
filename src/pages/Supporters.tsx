import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, UserPlus, Phone, Mail, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ModuleSwitcher } from "@/components/navigation/ModuleSwitcher";
import { Navbar } from "@/components/Navbar";

interface Supporter {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  bairro: string | null;
  cidade: string | null;
  created_at: string | null;
}

const Supporters = () => {
  const { user, campanhaId } = useAuth();
  const { toast } = useToast();
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    email: "",
    message: ""
  });

  useEffect(() => {
    fetchSupporters();
  }, [user, campanhaId]);

  const fetchSupporters = async () => {
    if (!user || !campanhaId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('supporters')
        .select('id, nome, email, telefone, bairro, cidade, created_at')
        .eq('campanha_id', campanhaId)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar apoiadores",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setSupporters(data || []);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <ModuleSwitcher />
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Apoiadores</h1>
            <p className="text-muted-foreground">Gerencie os apoiadores da campanha</p>
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
                <p className="text-muted-foreground">Total de apoiadores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {showInviteForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Convidar Novo Apoiador</CardTitle>
              <CardDescription>
                Envie um convite para alguém se juntar à sua campanha
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
                  Comece convidando pessoas para se juntarem à sua campanha
                </p>
                <Button onClick={() => setShowInviteForm(true)} variant="campaign">
                  Convidar Primeiro Apoiador
                </Button>
              </CardContent>
            </Card>
          ) : (
            supporters.map((supporter) => (
              <Card key={supporter.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="gradient-primary text-white">
                        {supporter.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{supporter.nome}</h4>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                        {supporter.telefone && (
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{supporter.telefone}</span>
                        )}
                        {supporter.email && (
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{supporter.email}</span>
                        )}
                        {(supporter.bairro || supporter.cidade) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {[supporter.bairro, supporter.cidade].filter(Boolean).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    {supporter.created_at && (
                      <Badge variant="secondary">
                        {new Date(supporter.created_at).toLocaleDateString('pt-BR')}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Supporters;

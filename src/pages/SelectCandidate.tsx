import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Users, Building2, LogOut } from "lucide-react";

interface AvailableCandidate {
  candidate_id: string;
  candidate_name: string;
  candidate_party: string | null;
  candidate_position: string | null;
  is_default: boolean;
}

const SelectCandidate = () => {
  const { user, profile, selectCandidate, loading: authLoading, signOut } = useAuth();
  const [candidates, setCandidates] = useState<AvailableCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // ProtectedRoute já cuida de redirecionar para /auth se não autenticado
  // e não redireciona para cá se profile.candidate_id já existe
  useEffect(() => {
<<<<<<< HEAD
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    // Removido o redirecionamento automático para permitir que o usuário sempre veja a tela de seleção
    // se ele for explicitamente para esta rota ou se o sistema o mandar para cá após o login.

    if (user) {
      fetchAvailableCandidates();
    }
  }, [user, authLoading, navigate]);
=======
    if (user && !authLoading) {
      fetchAvailableCandidates();
    }
  }, [user, authLoading]);
>>>>>>> 2717423c34ef21b22f045184ff8cbc437f4848d5

  const fetchAvailableCandidates = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_available_candidates', { _user_id: user?.id });

      if (error) throw error;
      setCandidates(data || []);
    } catch (error) {
      console.error("Erro ao buscar candidatos:", error);
      toast({
        title: "Erro ao carregar candidatos",
        description: "Não foi possível carregar a lista de candidatos disponíveis.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCandidate = async (candidateId: string) => {
    setSelecting(candidateId);
    try {
      await selectCandidate(candidateId);
      toast({
        title: "Candidato selecionado!",
        description: "Acesso liberado ao sistema."
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao selecionar candidato:", error);
      toast({
        title: "Erro ao selecionar candidato",
        description: "Não foi possível vincular sua sessão a este candidato.",
        variant: "destructive"
      });
    } finally {
      setSelecting(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-4">
          <Skeleton className="h-12 w-48 mx-auto" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 gradient-hero rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">CampanhaGov</h1>
            <p className="text-sm text-muted-foreground">Selecione sua Unidade de Controle</p>
          </div>
        </div>

        <Card className="mb-6 border-primary/20 shadow-md">
          <CardHeader>
            <CardTitle>Bem-vindo, {profile?.name || user?.email}</CardTitle>
            <CardDescription>
              Para acessar os dados da campanha, você precisa selecionar um dos candidatos abaixo aos quais você está associado.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-4">
          {candidates.length === 0 ? (
            <Card className="text-center py-12 border-dashed">
              <CardContent>
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Nenhum candidato associado</h3>
                <p className="text-muted-foreground mb-6">
                  Você ainda não possui permissão para acessar nenhum candidato. 
                  Entre em contato com o administrador.
                </p>
                <Button variant="outline" onClick={() => signOut()} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Sair do Sistema
                </Button>
              </CardContent>
            </Card>
          ) : (
            candidates.map((candidate) => (
              <Card 
                key={candidate.candidate_id}
                className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 border-2 border-transparent"
                onClick={() => handleSelectCandidate(candidate.candidate_id)}
              >
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Building2 className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{candidate.candidate_name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {candidate.candidate_party && (
                          <Badge variant="secondary" className="font-medium">
                            {candidate.candidate_party}
                          </Badge>
                        )}
                        {candidate.candidate_position && (
                          <span className="text-sm text-muted-foreground font-medium">
                            • {candidate.candidate_position}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="campaign"
                    disabled={selecting === candidate.candidate_id}
                    className="shadow-sm"
                  >
                    {selecting === candidate.candidate_id ? "Acessando..." : "Acessar"}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={() => signOut()} className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Sair da conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectCandidate;
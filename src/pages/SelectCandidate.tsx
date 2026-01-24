import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Users, Building2 } from "lucide-react";

interface AvailableCandidate {
  candidate_id: string;
  candidate_name: string;
  candidate_party: string | null;
  candidate_position: string | null;
  is_default: boolean;
}

const SelectCandidate = () => {
  const { user, profile, selectCandidate, loading: authLoading } = useAuth();
  const [candidates, setCandidates] = useState<AvailableCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Master admin email que não precisa selecionar candidato
  const MASTER_ADMIN_EMAIL = "nailton.alsampaio@gmail.com";

  useEffect(() => {
    // Se for o master admin, redirecionar direto
    if (user?.email === MASTER_ADMIN_EMAIL) {
      navigate("/");
      return;
    }

    // Se já tem candidato selecionado, redirecionar
    if (profile?.candidate_id) {
      navigate("/");
      return;
    }

    // Só busca candidatos se o usuário estiver logado
    if (user) {
      fetchAvailableCandidates();
    }
  }, [user, profile, navigate]);

  const fetchAvailableCandidates = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .rpc('get_user_available_candidates', { _user_id: user.id });

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
        description: "Você está agora trabalhando com este candidato."
      });
      navigate("/");
    } catch (error) {
      console.error("Erro ao selecionar candidato:", error);
      toast({
        title: "Erro ao selecionar candidato",
        description: "Não foi possível selecionar o candidato.",
        variant: "destructive"
      });
    } finally {
      setSelecting(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 gradient-hero rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Sem Candidatos Disponíveis</CardTitle>
            <CardDescription>
              Você ainda não foi associado a nenhum candidato. Entre em contato com o administrador do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Voltar ao Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 gradient-hero rounded-xl flex items-center justify-center">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">CampanhaGov</h1>
            <p className="text-sm text-muted-foreground">Selecione um Candidato</p>
          </div>
        </div>

        {/* Description */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Escolha o Candidato</CardTitle>
            <CardDescription>
              Você tem acesso a múltiplos candidatos. Selecione qual deseja gerenciar agora.
              Você pode trocar a qualquer momento pelo menu do usuário.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Candidate List */}
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <Card 
              key={candidate.candidate_id}
              className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
              onClick={() => handleSelectCandidate(candidate.candidate_id)}
            >
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{candidate.candidate_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {candidate.candidate_party && (
                        <Badge variant="secondary">{candidate.candidate_party}</Badge>
                      )}
                      {candidate.candidate_position && (
                        <span className="text-sm text-muted-foreground">
                          {candidate.candidate_position}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="campaign"
                  disabled={selecting === candidate.candidate_id}
                >
                  {selecting === candidate.candidate_id ? "Selecionando..." : "Selecionar"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectCandidate;

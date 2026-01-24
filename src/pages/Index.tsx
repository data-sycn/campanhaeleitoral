import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { CampaignHero } from "@/components/CampaignHero";
import { DashboardModuleGrid, DashboardWelcome } from "@/components/dashboard/index";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading, needsCandidateSelection } = useAuth();
  const navigate = useNavigate();

  // Redireciona para seleção de candidato dentro do useEffect
  useEffect(() => {
    if (!loading && needsCandidateSelection) {
      navigate("/select-candidate");
    }
  }, [loading, needsCandidateSelection, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Carregando plataforma...</p>
        </div>
      </div>
    );
  }

  // Se precisa selecionar candidato, mostra loading enquanto redireciona
  if (needsCandidateSelection) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Redirecionando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver logado, mostra a Landing Page
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <CampaignHero />
        
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Pronto para profissionalizar sua campanha?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Junte-se a centenas de candidatos que já utilizam o CampanhaGov para gerir seus recursos e equipes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button 
                variant="campaign" 
                size="lg"
                onClick={() => navigate('/auth')}
                className="flex-1 text-lg py-6"
              >
                Começar Agora
              </Button>
            </div>
          </div>
        </section>

        <footer className="py-12 border-t bg-background">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>© 2024 CampanhaGov. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    );
  }

  // Se estiver logado, mostra a Grid de Módulos
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <DashboardWelcome />
        <DashboardModuleGrid />
      </main>
    </div>
  );
};

export default Index;
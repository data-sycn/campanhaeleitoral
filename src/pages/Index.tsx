import { Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { CampaignHero } from "@/components/CampaignHero";
import { Dashboard } from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Carregando...</div>
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <CampaignHero />
        
        {/* Login Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-8">Acesse a Plataforma</h2>
            <p className="text-muted-foreground mb-8">
              Faça login ou cadastre-se para começar a usar o CampanhaGov
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button 
                variant="campaign" 
                onClick={() => window.location.href = '/auth'}
                className="flex-1"
              >
                Entrar / Cadastrar
              </Button>
            </div>
            
            <div className="mt-8 p-6 bg-background rounded-xl shadow-card max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground">
                <strong>CampanhaGov:</strong> Plataforma completa para gestão de campanhas políticas 
                com controle de orçamento, equipe e relatórios detalhados.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Show dashboard for authenticated users
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;

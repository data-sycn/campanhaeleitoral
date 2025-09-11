import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { CampaignHero } from "@/components/CampaignHero";
import { Dashboard } from "@/components/Dashboard";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Simulate authentication state - in real app this would come from Supabase auth
  const [user, setUser] = useState<{
    name: string;
    role: 'admin' | 'candidate' | 'supporter';
    avatar?: string;
  } | null>(null);

  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  const handleLogin = (role: 'admin' | 'candidate' | 'supporter') => {
    const names = {
      admin: 'Nailton Administrador',
      candidate: 'João Silva',
      supporter: 'Maria Santos'
    };
    
    setUser({
      name: names[role],
      role,
      avatar: undefined
    });
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <CampaignHero />
        
        {/* Demo Login Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-8">Demonstração da Plataforma</h2>
            <p className="text-muted-foreground mb-8">
              Acesse a plataforma com diferentes perfis para ver como funciona:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <Button 
                variant="campaign" 
                onClick={() => handleLogin('admin')}
                className="flex-1"
              >
                Entrar como Administrador
              </Button>
              <Button 
                variant="civic" 
                onClick={() => handleLogin('candidate')}
                className="flex-1"
              >
                Entrar como Candidato
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleLogin('supporter')}
                className="flex-1"
              >
                Entrar como Apoiador
              </Button>
            </div>
            
            <div className="mt-8 p-6 bg-background rounded-xl shadow-card max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground">
                <strong>Nota:</strong> Esta é uma demonstração. Para funcionalidade completa de autenticação, 
                banco de dados e relatórios, conecte sua conta Supabase.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      <main className="container mx-auto px-4 py-8">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;

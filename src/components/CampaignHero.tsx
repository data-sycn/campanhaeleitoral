import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Shield, 
  BarChart3 
} from "lucide-react";
import heroImage from "@/assets/campaign-hero.jpg";

export function CampaignHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm gradient-primary text-white border-0">
            <Shield className="w-4 h-4 mr-2" />
            Plataforma Oficial de Gestão de Campanhas
          </Badge>

          {/* Main Heading */}
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Gerencie sua{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Campanha Política
            </span>{" "}
            com Transparência
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Centralize análises de votos históricos, controle orçamentário, gestão de equipe 
            e relatórios detalhados em uma única plataforma segura e profissional.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6">
              <Users className="w-5 h-5 mr-2" />
              Acessar Plataforma
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              <BarChart3 className="w-5 h-5 mr-2" />
              Ver Demonstração
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-xl gradient-card shadow-card transition-smooth hover:shadow-elevated">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Análise de Dados</h3>
              <p className="text-sm text-muted-foreground">
                Visualize dados eleitorais históricos e tendências de votação
              </p>
            </div>

            <div className="p-6 rounded-xl gradient-card shadow-card transition-smooth hover:shadow-elevated">
              <div className="w-12 h-12 gradient-secondary rounded-lg flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Gestão Financeira</h3>
              <p className="text-sm text-muted-foreground">
                Controle total do orçamento e execução financeira da campanha
              </p>
            </div>

            <div className="p-6 rounded-xl gradient-card shadow-card transition-smooth hover:shadow-elevated">
              <div className="w-12 h-12 gradient-hero rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Colaboração</h3>
              <p className="text-sm text-muted-foreground">
                Trabalhe em equipe com apoiadores e controle de permissões
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
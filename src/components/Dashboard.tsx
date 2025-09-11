import { KPICard } from "@/components/KPICard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Vote, 
  FileText, 
  MapPin,
  Calendar,
  AlertTriangle
} from "lucide-react";

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="gradient-card p-6 rounded-xl shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Bem-vindo, João Silva</h2>
            <p className="text-muted-foreground">
              Candidato a Deputado Federal - Partido XYZ - Estado: SP
            </p>
            <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/20">
              Campanha 2026 Ativa
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Último acesso</p>
            <p className="font-medium">Hoje, 14:30</p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Orçamento Total"
          value="R$ 485.600"
          change={{ value: "+12%", trend: "up" }}
          icon={DollarSign}
          variant="primary"
        />
        <KPICard
          title="Gastos Realizados"
          value="R$ 147.230"
          change={{ value: "30%", trend: "neutral" }}
          icon={TrendingUp}
          variant="secondary"
        />
        <KPICard
          title="Apoiadores Ativos"
          value={24}
          change={{ value: "+3", trend: "up" }}
          icon={Users}
          variant="success"
        />
        <KPICard
          title="Votos Históricos"
          value="23.456"
          change={{ value: "+8%", trend: "up" }}
          icon={Vote}
          variant="default"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 shadow-card border-0 gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>
              Últimas movimentações da campanha
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Despesa adicionada: Material gráfico</p>
                <p className="text-xs text-muted-foreground">R$ 2.450,00 - Há 2 horas</p>
              </div>
              <Badge variant="outline" className="text-xs">
                Novo
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
              <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Novo apoiador: Maria Santos</p>
                <p className="text-xs text-muted-foreground">Região: Zona Sul - Há 4 horas</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Relatório mensal gerado</p>
                <p className="text-xs text-muted-foreground">Setembro 2024 - Ontem</p>
              </div>
            </div>

            <div className="pt-4">
              <Button variant="outline" className="w-full">
                Ver Todas as Atividades
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-card border-0 gradient-card">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="campaign" className="w-full justify-start gap-3">
              <DollarSign className="w-4 h-4" />
              Adicionar Despesa
            </Button>
            <Button variant="civic" className="w-full justify-start gap-3">
              <Users className="w-4 h-4" />
              Convidar Apoiador
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <FileText className="w-4 h-4" />
              Gerar Relatório
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <MapPin className="w-4 h-4" />
              Análise Regional
            </Button>
            
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-warning mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Atenção Necessária</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                3 despesas aguardando aprovação
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Revisar Pendências
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
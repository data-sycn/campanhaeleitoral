import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Shield, AlertTriangle, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardData } from "@/components/dashboard/useDashboardData";
import { useRecurrenceAlerts, useEffectivenessRanking } from "@/components/dashboard/useDashboardAlerts";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import { CampaignSelector } from "@/components/dashboard/CampaignSelector";
import { SupportersHeatmap } from "@/components/dashboard/SupportersHeatmap";
import { LeafletHeatmap } from "@/components/dashboard/LeafletHeatmap";
import { SimultaneityWidget } from "@/components/dashboard/SimultaneityWidget";
import { AuditTimeline } from "@/components/dashboard/AuditTimeline";

const Dashboard = () => {
  const { userRoles } = useAuth();
  const isMaster = userRoles.includes("master");
  const [campanhaId, setCampanhaId] = useState<string | null>(null);
  const { stats, supporterPoints, heatmapData, auditData, activeCheckins, loading } = useDashboardData(campanhaId);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const recurrenceAlerts = useRecurrenceAlerts(campanhaId);
  const effectivenessRanking = useEffectivenessRanking(campanhaId);

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-muted rounded-lg" />)}
            </div>
            <div className="h-80 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dossiê de Bolso</h1>
            <p className="text-muted-foreground">Visão executiva da campanha</p>
          </div>
          <div className="flex items-center gap-3">
            {isMaster && <CampaignSelector value={campanhaId} onChange={setCampanhaId} />}
            <Button variant="outline" onClick={() => navigate("/modulos")} className="gap-2">
              <LayoutGrid className="w-4 h-4" />
              Módulos
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2"><BarChart3 className="w-4 h-4" /> Visão Geral</TabsTrigger>
            <TabsTrigger value="audit" className="gap-2"><Shield className="w-4 h-4" /> Auditoria</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">

            {/* Recurrence Alerts */}
            {recurrenceAlerts.length > 0 && (
              <Card className="border-orange-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="w-4 h-4" />
                    Alertas de Recorrência
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recurrenceAlerts.slice(0, 5).map((alert) => (
                      <div key={alert.street_id} className="flex items-center justify-between p-3 bg-orange-500/5 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{alert.street_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {alert.bairro && `${alert.bairro} — `}{alert.cidade}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-orange-600 border-orange-300">
                            {alert.days_since} dias sem visita
                          </Badge>
                          {alert.cidade && (
                            <button
                              onClick={() => navigate(`/dossie/${encodeURIComponent(alert.cidade!)}`)}
                              className="block text-xs text-primary hover:underline mt-1"
                            >
                              Ver dossiê →
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Effectiveness Ranking */}
            {effectivenessRanking.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    Ranking de Efetividade por Cidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {effectivenessRanking.slice(0, 5).map((item, idx) => (
                      <div key={item.cidade} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className={`font-bold text-lg ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                            #{idx + 1}
                          </span>
                          <div>
                            <p className="font-medium text-sm">{item.cidade}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.streets_visited} ruas • {formatCurrency(item.total_cost)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {formatCurrency(item.cost_per_street)}/rua
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leaflet Map + Simultaneity Widget */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LeafletHeatmap data={supporterPoints} loading={false} />
              </div>
              <SimultaneityWidget data={activeCheckins} loading={false} />
            </div>

            {/* Supporters Heatmap */}
            <SupportersHeatmap data={heatmapData} loading={false} />
          </TabsContent>


          <TabsContent value="audit">
            <AuditTimeline data={auditData} loading={false} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;

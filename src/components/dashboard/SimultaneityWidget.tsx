import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, MapPin } from "lucide-react";

interface ActiveCheckin {
  cidade: string | null;
  bairro: string | null;
  count: number;
}

interface SimultaneityWidgetProps {
  data: ActiveCheckin[];
  loading: boolean;
}

export function SimultaneityWidget({ data, loading }: SimultaneityWidgetProps) {
  const totalActive = data.reduce((s, d) => s + d.count, 0);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="w-5 h-5" /> Ações Simultâneas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Activity className="w-5 h-5" /> Ações Simultâneas
          </span>
          <Badge variant="secondary" className="text-lg px-3">
            {totalActive}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Activity className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-sm">Nenhuma ação ativa no momento.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((item, i) => {
              const label = [item.cidade, item.bairro].filter(Boolean).join(" / ") || "Sem localização";
              return (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                    </span>
                    <span className="text-sm font-bold">{item.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users } from "lucide-react";

interface HeatmapEntry {
  cidade: string | null;
  bairro: string | null;
  total: number;
}

interface SupportersHeatmapProps {
  data: HeatmapEntry[];
  loading: boolean;
}

export function SupportersHeatmap({ data, loading }: SupportersHeatmapProps) {
  const maxTotal = Math.max(...data.map((d) => d.total), 1);

  const getHeatColor = (ratio: number) => {
    if (ratio > 0.75) return "bg-red-500";
    if (ratio > 0.5) return "bg-orange-500";
    if (ratio > 0.25) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="w-5 h-5" /> Concentração de Apoiadores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="w-5 h-5" /> Concentração de Apoiadores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Users className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-sm">Nenhum apoiador cadastrado ainda.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="w-5 h-5" /> Concentração de Apoiadores
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.slice(0, 10).map((entry, i) => {
          const ratio = entry.total / maxTotal;
          const label = [entry.cidade, entry.bairro].filter(Boolean).join(" / ") || "Sem localização";
          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium truncate">{label}</span>
                <span className="text-muted-foreground">{entry.total}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getHeatColor(ratio)}`}
                  style={{ width: `${ratio * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

interface SupporterPoint {
  latitude: number | null;
  longitude: number | null;
  nome: string;
  bairro: string | null;
  cidade: string | null;
}

interface LeafletHeatmapProps {
  data: SupporterPoint[];
  loading: boolean;
}

/** Inner component that mounts a fresh Leaflet map each time its key changes */
function HeatmapCanvas({ points, height }: { points: SupporterPoint[]; height: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  const validPoints = points.filter(
    (d) => d.latitude != null && d.longitude != null
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Wait until container has real dimensions
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const init = () => {
      if (cancelled || !el) return;
      if (el.clientHeight === 0 || el.clientWidth === 0) {
        timer = setTimeout(init, 50);
        return;
      }

      const center: L.LatLngExpression =
        validPoints.length > 0
          ? [validPoints[0].latitude!, validPoints[0].longitude!]
          : [-14.235, -51.9253];

      const map = L.map(el).setView(center, validPoints.length > 0 ? 12 : 4);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 18,
      }).addTo(map);

      if (validPoints.length > 0) {
        const locationMap = new Map<string, { count: number; lat: number; lng: number; label: string }>();
        validPoints.forEach((p) => {
          const key = `${p.latitude!.toFixed(4)},${p.longitude!.toFixed(4)}`;
          const existing = locationMap.get(key);
          if (existing) {
            existing.count++;
          } else {
            locationMap.set(key, {
              count: 1,
              lat: p.latitude!,
              lng: p.longitude!,
              label: [p.bairro, p.cidade].filter(Boolean).join(", ") || p.nome,
            });
          }
        });

        const heatPoints: [number, number, number][] = [];
        locationMap.forEach((loc) => {
          heatPoints.push([loc.lat, loc.lng, loc.count]);
        });

        const maxIntensity = Math.max(...heatPoints.map((p) => p[2]), 1);

        // Add heat layer after map is fully ready
        map.whenReady(() => {
          if (cancelled) return;
          L.heatLayer(heatPoints, {
            radius: 30,
            blur: 20,
            maxZoom: 16,
            max: maxIntensity,
            gradient: {
              0.2: "#2196F3",
              0.4: "#4CAF50",
              0.6: "#FFEB3B",
              0.8: "#FF9800",
              1.0: "#F44336",
            },
          }).addTo(map);
        });

        // Circle markers for interactivity
        locationMap.forEach((loc) => {
          L.circleMarker([loc.lat, loc.lng], {
            radius: 4,
            fillColor: "transparent",
            color: "transparent",
            weight: 0,
            fillOpacity: 0,
          })
            .bindPopup(`<strong>${loc.label}</strong><br/>${loc.count} apoiador${loc.count > 1 ? "es" : ""}`)
            .addTo(map);
        });

        if (validPoints.length > 1) {
          const bounds = L.latLngBounds(
            validPoints.map((p) => [p.latitude!, p.longitude!] as L.LatLngExpression)
          );
          map.fitBounds(bounds, { padding: [30, 30] });
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [validPoints.length]); // only re-init if data count changes

  return (
    <div
      ref={containerRef}
      className={`w-full rounded-lg overflow-hidden ${height}`}
    />
  );
}

export function LeafletHeatmap({ data, loading }: LeafletHeatmapProps) {
  const [fullscreen, setFullscreen] = useState(false);

  const validPoints = data.filter(
    (d) => d.latitude != null && d.longitude != null
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="w-5 h-5" /> Mapa de Calor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {fullscreen && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />}
      <Card className={
        fullscreen
          ? "fixed inset-0 z-50 rounded-none flex flex-col m-0 border-0"
          : ""
      }>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 shrink-0">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="w-5 h-5" /> Mapa de Calor — Apoiadores
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setFullscreen((f) => !f)}
            title={fullscreen ? "Sair da tela cheia" : "Tela cheia"}
          >
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </CardHeader>
        <CardContent className={fullscreen ? "flex-1 p-0 min-h-0 relative" : ""}>
          {validPoints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <MapPin className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm">Nenhum apoiador com geolocalização cadastrado.</p>
              <p className="text-xs mt-1">Cadastre apoiadores com endereço para preencher o mapa automaticamente.</p>
            </div>
          ) : (
            /* key={fullscreen} forces full remount with correct container dimensions */
            <div className={fullscreen ? "absolute inset-0" : ""}>
              <HeatmapCanvas
                key={fullscreen ? "fs" : "normal"}
                points={data}
                height={fullscreen ? "h-full" : "h-80"}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

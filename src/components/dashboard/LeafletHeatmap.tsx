import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

export function LeafletHeatmap({ data, loading }: LeafletHeatmapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const validPoints = data.filter(
    (d) => d.latitude != null && d.longitude != null
  );

  useEffect(() => {
    if (!mapRef.current || loading) return;

    // Clean up previous instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center: Brazil
    const center: L.LatLngExpression =
      validPoints.length > 0
        ? [validPoints[0].latitude!, validPoints[0].longitude!]
        : [-14.235, -51.9253];

    const map = L.map(mapRef.current).setView(center, validPoints.length > 0 ? 12 : 4);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxZoom: 18,
    }).addTo(map);

    // Custom icon
    const icon = L.divIcon({
      className: "custom-marker",
      html: `<div style="width:12px;height:12px;border-radius:50%;background:hsl(0 72% 50%);border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });

    // Group by location for clustering info
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

    locationMap.forEach((loc) => {
      const size = Math.min(8 + loc.count * 3, 30);
      const opacity = Math.min(0.4 + loc.count * 0.1, 0.9);
      
      L.circleMarker([loc.lat, loc.lng], {
        radius: size,
        fillColor: "hsl(0, 72%, 50%)",
        color: "white",
        weight: 2,
        opacity: 1,
        fillOpacity: opacity,
      })
        .bindPopup(`<strong>${loc.label}</strong><br/>${loc.count} apoiador${loc.count > 1 ? "es" : ""}`)
        .addTo(map);
    });

    // Fit bounds if we have points
    if (validPoints.length > 1) {
      const bounds = L.latLngBounds(
        validPoints.map((p) => [p.latitude!, p.longitude!] as L.LatLngExpression)
      );
      map.fitBounds(bounds, { padding: [30, 30] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data, loading]);

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="w-5 h-5" /> Mapa de Calor — Apoiadores
        </CardTitle>
      </CardHeader>
      <CardContent>
        {validPoints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <MapPin className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-sm">Nenhum apoiador com geolocalização cadastrado.</p>
          </div>
        ) : (
          <div ref={mapRef} className="h-80 rounded-lg overflow-hidden" />
        )}
      </CardContent>
    </Card>
  );
}

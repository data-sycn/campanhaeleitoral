import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

export function DashboardWelcome() {
  const { profile } = useAuth();

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Olá, {profile?.name || "Candidato"}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie sua campanha de forma inteligente e eficiente
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
            Campanha 2026 Ativa
          </Badge>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            <span>{new Date().toLocaleDateString("pt-BR")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

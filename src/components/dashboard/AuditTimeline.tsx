import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Clock, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Json } from "@/integrations/supabase/types";

interface AuditEntry {
  id: string;
  action: string;
  table_name: string;
  created_at: string;
  new_data: Json | null;
  record_id: string | null;
  user_id: string | null;
}

interface AuditTimelineProps {
  data: AuditEntry[];
  loading: boolean;
}

const actionConfig: Record<string, { icon: typeof PlusCircle; color: string; label: string }> = {
  INSERT: { icon: PlusCircle, color: "text-green-600", label: "Criação" },
  UPDATE: { icon: Edit, color: "text-blue-600", label: "Atualização" },
  DELETE: { icon: Trash2, color: "text-red-600", label: "Exclusão" },
};

const tableLabels: Record<string, string> = {
  budgets: "Orçamento",
  expenses: "Despesa",
  supporters: "Apoiador",
  campanhas: "Campanha",
  profiles: "Perfil",
  candidates: "Candidato",
  user_roles: "Permissão",
};

function summarizeData(data: Json | null): string {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "";
  const obj = data as Record<string, Json | undefined>;
  const keys = ["nome", "name", "title", "description", "amount", "total_planned"];
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return `${key}: ${String(obj[key]).substring(0, 50)}`;
    }
  }
  return "";
}

export function AuditTimeline({ data, loading }: AuditTimelineProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> Linha do Tempo</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> Linha do Tempo</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <FileText className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-sm">Nenhuma ação registrada.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> Linha do Tempo de Auditoria</CardTitle></CardHeader>
      <CardContent>
        <div className="relative pl-6 space-y-4">
          <div className="absolute left-2.5 top-2 bottom-2 w-px bg-border" />
          {data.map((entry) => {
            const config = actionConfig[entry.action] || actionConfig.UPDATE;
            const Icon = config.icon;
            const summary = summarizeData(entry.new_data);
            return (
              <div key={entry.id} className="relative flex gap-3">
                <div className={`absolute -left-3.5 mt-1 w-5 h-5 rounded-full bg-card border-2 border-border flex items-center justify-center`}>
                  <Icon className={`w-3 h-3 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0 pl-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">{config.label}</Badge>
                    <span className="text-sm font-medium">{tableLabels[entry.table_name] || entry.table_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(entry.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  {summary && <p className="text-xs text-muted-foreground mt-1 truncate">{summary}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Campanha {
  id: string;
  nome: string;
  municipio: string | null;
  partido: string | null;
}

interface CampaignGateProps {
  onSelected: () => void;
}

export const CampaignGate = ({ onSelected }: CampaignGateProps) => {
  const { user, isMaster, isAdmin, setSelectedCampanhaId } = useAuth();
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      try {
        if (isMaster) {
          const { data } = await supabase
            .from("campanhas")
            .select("id, nome, municipio, partido")
            .is("deleted_at", null)
            .order("nome");
          setCampanhas(data || []);
        } else if (isAdmin) {
          const { data: links } = await supabase
            .from("user_campanhas")
            .select("campanha_id")
            .eq("user_id", user.id);
          const ids = links?.map((l) => l.campanha_id) || [];
          if (ids.length > 0) {
            const { data } = await supabase
              .from("campanhas")
              .select("id, nome, municipio, partido")
              .in("id", ids)
              .is("deleted_at", null)
              .order("nome");
            setCampanhas(data || []);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user, isMaster, isAdmin]);

  const handleSelect = (id: string) => {
    setSelectedCampanhaId(id);
    onSelected();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-9 h-9 text-primary-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Selecione a campanha ativa</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Qual campanha deseja acessar?</CardTitle>
            <CardDescription>
              Você está vinculado a múltiplas campanhas. Selecione uma para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : campanhas.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-4">
                Nenhuma campanha encontrada.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {campanhas.map((c) => (
                  <Button
                    key={c.id}
                    variant="outline"
                    className="w-full justify-start h-auto py-3 px-4"
                    onClick={() => handleSelect(c.id)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{c.nome}</div>
                      {(c.municipio || c.partido) && (
                        <div className="text-xs text-muted-foreground">
                          {[c.municipio, c.partido].filter(Boolean).join(" · ")}
                        </div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

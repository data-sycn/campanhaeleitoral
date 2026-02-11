import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Play, Square, Plus, Search, Loader2 } from "lucide-react";
import { ModuleSwitcher } from "@/components/navigation/ModuleSwitcher";

interface Street {
  id: string;
  nome: string;
  bairro: string | null;
  cidade: string | null;
}

interface Checkin {
  id: string;
  street_id: string;
  status: string;
  started_at: string;
  ended_at: string | null;
  notes: string | null;
  streets?: {
    nome: string;
    bairro: string | null;
    cidade: string | null;
  };
}

const OFFLINE_KEY = "checkin_offline_queue";

const StreetCheckin = () => {
  const { user, campanhaId } = useAuth();
  const { toast } = useToast();
  const [streets, setStreets] = useState<Street[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStreetId, setSelectedStreetId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddStreet, setShowAddStreet] = useState(false);
  const [newStreet, setNewStreet] = useState({ nome: "", bairro: "", cidade: "" });
  const [creating, setCreating] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user || !campanhaId) { setLoading(false); return; }
    try {
      const [streetsRes, checkinsRes] = await Promise.all([
        supabase.from("streets").select("*").eq("campanha_id", campanhaId).order("nome"),
        supabase.from("street_checkins").select("*, streets(nome, bairro, cidade)").eq("campanha_id", campanhaId).order("started_at", { ascending: false }).limit(50),
      ]);
      setStreets((streetsRes.data as Street[]) || []);
      setCheckins((checkinsRes.data as any[]) || []);
    } catch (err) {
      console.error("Error fetching checkin data:", err);
    } finally {
      setLoading(false);
    }
  }, [user, campanhaId]);

  useEffect(() => { 
    fetchData(); 
    const syncOffline = async () => {
      const queue = JSON.parse(localStorage.getItem(OFFLINE_KEY) || "[]");
      if (queue.length > 0) {
        const remaining: any[] = [];
        for (const item of queue) {
          const { error } = await supabase.from("street_checkins").insert(item);
          if (error) remaining.push(item);
        }
        localStorage.setItem(OFFLINE_KEY, JSON.stringify(remaining));
        if (remaining.length < queue.length) {
          toast({ title: "Sincronizado!", description: "Check-ins offline enviados." });
          fetchData();
        }
      }
    };
    syncOffline();
  }, [fetchData, toast]);

  const handleStartCheckin = async () => {
    if (!selectedStreetId || !user || !campanhaId) return;
    setCreating(true);

    try {
      // 1. Double check concurrency rule (Malha Única)
      const { data: activeCheckins, error: checkError } = await supabase
        .from("street_checkins")
        .select("id")
        .eq("street_id", selectedStreetId)
        .eq("status", "active");

      if (checkError) throw checkError;

      if (activeCheckins && activeCheckins.length > 0) {
        toast({
          title: "Conflito detectado",
          description: "Já existe uma equipe trabalhando nesta rua no momento.",
          variant: "destructive",
        });
        setCreating(false);
        return;
      }

      const payload = {
        street_id: selectedStreetId,
        campanha_id: campanhaId,
        user_id: user.id,
        status: "active",
        notes: notes || null,
      };

      const { error } = await supabase.from("street_checkins").insert(payload);
      if (error) throw error;

      toast({ title: "Check-in iniciado!", description: "Ação de rua registrada com sucesso." });
      setNotes("");
      setSelectedStreetId("");
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast({ title: "Erro", description: "Não foi possível iniciar o check-in.", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const handleEndCheckin = async (checkinId: string) => {
    const { error } = await supabase
      .from("street_checkins")
      .update({ status: "completed", ended_at: new Date().toISOString() })
      .eq("id", checkinId);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Ação encerrada!" });
      fetchData();
    }
  };

  const handleAddStreet = async () => {
    if (!newStreet.nome || !campanhaId) return;
    setCreating(true);
    const { error } = await supabase.from("streets").insert({
      campanha_id: campanhaId,
      nome: newStreet.nome,
      bairro: newStreet.bairro || null,
      cidade: newStreet.cidade || null,
    });

    if (error) {
      if (error.code === '23505') {
        toast({ title: "Rua já cadastrada", description: "Este logradouro já existe nesta campanha.", variant: "destructive" });
      } else {
        toast({ title: "Erro ao cadastrar rua", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Rua cadastrada!" });
      setNewStreet({ nome: "", bairro: "", cidade: "" });
      setShowAddStreet(false);
      fetchData();
    }
    setCreating(false);
  };

  const filteredStreets = streets.filter((s) =>
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.bairro && s.bairro.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeCheckinsList = checkins.filter((c) => c.status === "active");
  const recentCheckins = checkins.filter((c) => c.status !== "active").slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48" />
            <div className="h-64 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6"><ModuleSwitcher /></div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Check-in de Rua</h1>
            <p className="text-muted-foreground">Registro de ações de campo em tempo real</p>
          </div>
          <Button onClick={() => setShowAddStreet(!showAddStreet)} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" /> Nova Rua
          </Button>
        </div>

        {showAddStreet && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Cadastrar Nova Rua</CardTitle>
              <CardDescription>Evite cadastrar ruas duplicadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Rua *</Label>
                  <Input value={newStreet.nome} onChange={(e) => setNewStreet((p) => ({ ...p, nome: e.target.value }))} placeholder="Ex: Av. Brasil" />
                </div>
                <div className="space-y-2">
                  <Label>Bairro</Label>
                  <Input value={newStreet.bairro} onChange={(e) => setNewStreet((p) => ({ ...p, bairro: e.target.value }))} placeholder="Centro" />
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input value={newStreet.cidade} onChange={(e) => setNewStreet((p) => ({ ...p, cidade: e.target.value }))} placeholder="Sua Cidade" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddStreet} disabled={!newStreet.nome || creating}>
                  {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Cadastrar
                </Button>
                <Button variant="outline" onClick={() => setShowAddStreet(false)}>Cancelar</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeCheckinsList.length > 0 && (
          <Card className="mb-6 border-green-500/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-green-600">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                </span>
                Atividades em Curso ({activeCheckinsList.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeCheckinsList.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-green-50/50 rounded-lg border border-green-100">
                  <div>
                    <p className="font-semibold">{c.streets?.nome || "Rua"}</p>
                    <p className="text-xs text-muted-foreground">
                      Iniciado em: {new Date(c.started_at).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => handleEndCheckin(c.id)} className="gap-2">
                    <Square className="w-3 h-3 fill-current" /> Encerrar
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle>Iniciar Nova Ação</CardTitle>
            <CardDescription>Escolha um logradouro livre para iniciar os trabalhos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pesquisar Logradouro</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Nome ou bairro..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Selecionar Rua</Label>
                <Select value={selectedStreetId} onValueChange={setSelectedStreetId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredStreets.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.nome} {s.bairro ? `— ${s.bairro}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notas do Início (Opcional)</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex: Ponto de encontro em frente à farmácia..." />
            </div>
            <Button onClick={handleStartCheckin} disabled={!selectedStreetId || creating} className="w-full sm:w-auto gap-2" variant="campaign">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              Iniciar Trabalho de Campo
            </Button>
          </CardContent>
        </Card>

        {recentCheckins.length > 0 && (
          <Card className="shadow-none border-dashed">
            <CardHeader>
              <CardTitle className="text-lg">Histórico de Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCheckins.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{c.streets?.nome || "Rua"}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(c.started_at).toLocaleTimeString("pt-BR")} - {c.ended_at ? new Date(c.ended_at).toLocaleTimeString("pt-BR") : "Em aberto"}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      Concluido
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StreetCheckin;
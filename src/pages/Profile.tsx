import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Crown, Shield, UserCheck, User as UserIcon, Mail, Calendar, Building2, Loader2, Save } from "lucide-react";

const ROLE_CONFIG: Record<string, { label: string; icon: typeof Crown; color: string }> = {
  master: { label: "Desenvolvedor", icon: Crown, color: "text-yellow-500" },
  admin: { label: "Administrador", icon: Shield, color: "text-destructive" },
  coordinator: { label: "Coordenador Geral", icon: UserCheck, color: "text-primary" },
  supervisor: { label: "Supervisor de Área", icon: UserCheck, color: "text-muted-foreground" },
  candidate: { label: "Candidato", icon: UserIcon, color: "text-primary" },
  supporter: { label: "Apoiador", icon: UserIcon, color: "text-muted-foreground" },
};

const Profile = () => {
  const { user, profile, userRoles, isMaster, campanhaId, refetchProfile } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [campaignName, setCampaignName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setAvatarUrl((profile as any).avatar_url || null);
    }
  }, [profile]);

  useEffect(() => {
    if (!campanhaId) { setCampaignName(null); return; }
    supabase.from("campanhas").select("nome, partido, municipio, uf").eq("id", campanhaId).single()
      .then(({ data }) => {
        if (data) {
          const parts = [data.nome];
          if (data.partido) parts[0] += ` (${data.partido})`;
          if (data.municipio) parts.push(`${data.municipio}/${data.uf}`);
          setCampaignName(parts.join(" - "));
        }
      });
  }, [campanhaId]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").update({
        name,
        avatar_url: avatarUrl,
      } as any).eq("id", user.id);
      if (error) throw error;
      await refetchProfile();
      toast({ title: "Perfil atualizado!" });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUploaded = async (url: string) => {
    setAvatarUrl(url);
    if (!user) return;
    await supabase.from("profiles").update({ avatar_url: url } as any).eq("id", user.id);
    refetchProfile();
  };

  const userInitials = (name || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const primaryRole = userRoles[0];
  const roleConfig = primaryRole ? ROLE_CONFIG[primaryRole] : null;

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Meu Perfil</h1>
          <p className="text-sm text-muted-foreground">Gerencie suas informações pessoais</p>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <AvatarUpload
                currentUrl={avatarUrl}
                fallback={userInitials}
                onUploaded={handleAvatarUploaded}
                folder="profiles"
                size="lg"
              />
              <div className="flex-1 text-center sm:text-left space-y-2">
                <h2 className="text-xl font-semibold">{name}</h2>
                <div className="flex items-center gap-2 justify-center sm:justify-start text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {roleConfig && (
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Badge variant="secondary" className="gap-1">
                      <roleConfig.icon className={`w-3 h-3 ${roleConfig.color}`} />
                      {roleConfig.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {isMaster ? "Acesso global" : campanhaId ? "Vinculado" : "Sem campanha"}
                    </span>
                  </div>
                )}
                {campaignName && (
                  <div className="flex items-center gap-2 justify-center sm:justify-start text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">{campaignName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 justify-center sm:justify-start text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">Membro desde {new Date(profile.created_at).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Editar Dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Nome Completo</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email || ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Funções</Label>
                <div className="flex flex-wrap gap-1">
                  {userRoles.map((role) => {
                    const rc = ROLE_CONFIG[role];
                    return (
                      <Badge key={role} variant="outline" className="text-xs gap-1">
                        {rc && <rc.icon className={`w-3 h-3 ${rc.color}`} />}
                        {rc?.label || role}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Campanha</Label>
                <p className="text-sm">{campaignName || (isMaster ? "Acesso global" : "Nenhuma")}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

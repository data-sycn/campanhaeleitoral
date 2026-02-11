import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, User, Users } from "lucide-react";

interface ProfileWithRole {
  id: string;
  name: string;
  parent_id: string | null;
  campanha_id: string | null;
  roles: string[];
}

export const AdminHierarchy = () => {
  const { campanhaId } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<ProfileWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [openNodes, setOpenNodes] = useState<Set<string>>(new Set());

  const fetchProfiles = useCallback(async () => {
    if (!campanhaId) { setLoading(false); return; }

    const { data: profilesData, error: pErr } = await supabase
      .from("profiles")
      .select("id, name, parent_id, campanha_id")
      .eq("campanha_id", campanhaId);

    if (pErr) {
      toast({ title: "Erro", description: pErr.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const { data: rolesData } = await supabase.from("user_roles").select("user_id, role");

    const rolesMap: Record<string, string[]> = {};
    rolesData?.forEach((r) => {
      if (!rolesMap[r.user_id]) rolesMap[r.user_id] = [];
      rolesMap[r.user_id].push(r.role);
    });

    const merged: ProfileWithRole[] = (profilesData || []).map((p) => ({
      ...p,
      roles: rolesMap[p.id] || [],
    }));

    setProfiles(merged);
    // open all leader nodes by default
    const leaders = new Set(merged.filter((p) => merged.some((c) => c.parent_id === p.id)).map((p) => p.id));
    setOpenNodes(leaders);
    setLoading(false);
  }, [campanhaId]);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);

  const handleParentChange = async (profileId: string, newParentId: string) => {
    const parentValue = newParentId === "none" ? null : newParentId;
    const { error } = await (supabase
      .from("profiles")
      .update({ parent_id: parentValue })
      .eq("id", profileId) as any);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Hierarquia atualizada" });
      fetchProfiles();
    }
  };

  const toggleNode = (id: string) => {
    setOpenNodes((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-48" />
        <div className="h-64 bg-muted rounded-lg" />
      </div>
    );
  }

  // Build tree: leaders = profiles with no parent, or whose parent is not in the list
  const profileIds = new Set(profiles.map((p) => p.id));
  const roots = profiles.filter((p) => !p.parent_id || !profileIds.has(p.parent_id));
  const children = (parentId: string) => profiles.filter((p) => p.parent_id === parentId);

  const renderMember = (profile: ProfileWithRole, indent: number) => {
    const kids = children(profile.id);
    const hasKids = kids.length > 0;

    return (
      <div key={profile.id} style={{ marginLeft: indent * 24 }}>
        <Collapsible open={openNodes.has(profile.id)} onOpenChange={() => hasKids && toggleNode(profile.id)}>
          <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
            {hasKids ? (
              <CollapsibleTrigger asChild>
                <button className="p-1 rounded hover:bg-muted">
                  <ChevronDown className={`w-4 h-4 transition-transform ${openNodes.has(profile.id) ? "" : "-rotate-90"}`} />
                </button>
              </CollapsibleTrigger>
            ) : (
              <span className="w-6" />
            )}

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                {hasKids ? <Users className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{profile.name}</p>
                <div className="flex gap-1">
                  {profile.roles.map((r) => (
                    <Badge key={r} variant="secondary" className="text-xs">{r}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <Select
              value={profile.parent_id || "none"}
              onValueChange={(v) => handleParentChange(profile.id, v)}
            >
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue placeholder="Sem líder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem líder</SelectItem>
                {profiles
                  .filter((p) => p.id !== profile.id)
                  .map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {hasKids && (
            <CollapsibleContent>
              {kids.map((kid) => renderMember(kid, indent + 1))}
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hierarquia de Lideranças</CardTitle>
        <CardDescription>Defina quem cada membro da equipe responde</CardDescription>
      </CardHeader>
      <CardContent>
        {profiles.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum membro encontrado nesta campanha</p>
          </div>
        ) : (
          <div className="space-y-1">
            {roots.map((root) => renderMember(root, 0))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

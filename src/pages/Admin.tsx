import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield, Building2, Link2, GitBranch } from "lucide-react";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminPermissions } from "@/components/admin/AdminPermissions";
import { AdminCandidates } from "@/components/admin/AdminCandidates";
import { AdminUserCandidates } from "@/components/admin/AdminUserCandidates";
import { AdminHierarchy } from "@/components/admin/AdminHierarchy";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("users");
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Administrador</h1>
        <p className="text-muted-foreground">Gerencie usuários, permissões e candidatos</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex mb-6">
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Usuários</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Permissões</span>
          </TabsTrigger>
          <TabsTrigger value="candidates" className="gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">Candidatos</span>
          </TabsTrigger>
          <TabsTrigger value="access" className="gap-2">
            <Link2 className="w-4 h-4" />
            <span className="hidden sm:inline">Acesso</span>
          </TabsTrigger>
          <TabsTrigger value="hierarchy" className="gap-2">
            <GitBranch className="w-4 h-4" />
            <span className="hidden sm:inline">Hierarquia</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <AdminUsers />
        </TabsContent>

        <TabsContent value="permissions">
          <AdminPermissions />
        </TabsContent>

        <TabsContent value="candidates">
          <AdminCandidates />
        </TabsContent>

        <TabsContent value="access">
          <AdminUserCandidates />
        </TabsContent>

        <TabsContent value="hierarchy">
          <AdminHierarchy />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;

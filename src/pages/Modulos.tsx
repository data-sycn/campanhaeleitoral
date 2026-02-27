import { Navbar } from "@/components/Navbar";
import { DashboardModuleGrid } from "@/components/dashboard/DashboardModuleGrid";
import { useAuth } from "@/hooks/useAuth";
import { CampaignSelector } from "@/components/dashboard/CampaignSelector";
import { useState } from "react";

const Modulos = () => {
  const { userRoles } = useAuth();
  const isMaster = userRoles.includes("master");
  const [campanhaId, setCampanhaId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Módulos</h1>
            <p className="text-sm text-muted-foreground">Acesse os módulos da plataforma</p>
          </div>
          {isMaster && <CampaignSelector value={campanhaId} onChange={setCampanhaId} />}
        </div>

        <DashboardModuleGrid />
      </div>
    </div>
  );
};

export default Modulos;

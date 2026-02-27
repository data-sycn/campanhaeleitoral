import { Navbar } from "@/components/Navbar";
import { DashboardModuleGrid } from "@/components/dashboard/DashboardModuleGrid";

const Modulos = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Módulos</h1>
          <p className="text-sm text-muted-foreground">Acesse os módulos da plataforma</p>
        </div>
        <DashboardModuleGrid />
      </div>
    </div>
  );
};

export default Modulos;

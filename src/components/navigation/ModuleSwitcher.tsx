import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  DollarSign, 
  Receipt, 
  Users, 
  FileText, 
  ChevronDown,
  Settings,
  Home,
  MapPin,
  Package
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const modules = [
  { id: "dashboard", title: "Dashboard", icon: BarChart3, route: "/dashboard" },
  { id: "budget", title: "Orçamento", icon: DollarSign, route: "/budget" },
  { id: "expenses", title: "Despesas", icon: Receipt, route: "/expenses" },
  { id: "supporters", title: "Apoiadores", icon: Users, route: "/supporters" },
  { id: "checkin", title: "Check-in de Rua", icon: MapPin, route: "/checkin" },
  { id: "resources", title: "Recursos", icon: Package, route: "/resources" },
  { id: "reports", title: "Relatórios", icon: FileText, route: "/reports" },
];

const adminModule = { id: "admin", title: "Administrador", icon: Settings, route: "/admin" };

export function ModuleSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  const allModules = isAdmin ? [...modules, adminModule] : modules;
  
  const currentModule = allModules.find(m => location.pathname.startsWith(m.route));
  const CurrentIcon = currentModule?.icon || BarChart3;

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate("/")}
        className="gap-2"
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Início</span>
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <CurrentIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{currentModule?.title || "Módulos"}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = location.pathname.startsWith(module.route);
            return (
              <DropdownMenuItem
                key={module.id}
                onClick={() => navigate(module.route)}
                className={isActive ? "bg-accent" : ""}
              >
                <Icon className="w-4 h-4 mr-2" />
                {module.title}
              </DropdownMenuItem>
            );
          })}
          
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate(adminModule.route)}
                className={location.pathname.startsWith(adminModule.route) ? "bg-accent" : ""}
              >
                <Settings className="w-4 h-4 mr-2" />
                {adminModule.title}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

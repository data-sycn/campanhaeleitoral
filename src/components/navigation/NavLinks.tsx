import { NavItem } from "./NavItem";
import { 
  BarChart3, 
  DollarSign, 
  Receipt, 
  Users, 
  FileText,
  Settings
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
  { icon: DollarSign, label: "Orçamento", path: "/budget" },
  { icon: Receipt, label: "Despesas", path: "/expenses" },
  { icon: Users, label: "Apoiadores", path: "/supporters" },
  { icon: FileText, label: "Relatórios", path: "/reports" },
];

export function NavLinks() {
  const { isAdmin } = useAuth();

  return (
    <div className="hidden md:flex items-center gap-1">
      {navItems.map((item) => (
        <NavItem
          key={item.path}
          icon={item.icon}
          label={item.label}
          path={item.path}
        />
      ))}
      {isAdmin && (
        <NavItem
          icon={Settings}
          label="Admin"
          path="/admin"
        />
      )}
    </div>
  );
}
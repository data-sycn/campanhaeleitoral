import { NavItem } from "./NavItem";
import { 
  BarChart3, 
  DollarSign, 
  Receipt, 
  Users, 
  FileText 
} from "lucide-react";

const navItems = [
  { icon: BarChart3, label: "Dashboard", path: "/" },
  { icon: DollarSign, label: "Orçamento", path: "/budget" },
  { icon: Receipt, label: "Despesas", path: "/expenses" },
  { icon: Users, label: "Apoiadores", path: "/supporters" },
  { icon: FileText, label: "Relatórios", path: "/reports" },
];

export function NavLinks() {
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
    </div>
  );
}
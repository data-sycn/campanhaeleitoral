import { NavItem } from "./NavItem";
import { LayoutDashboard } from "lucide-react";

export function NavLinks() {
  return (
    <div className="hidden md:flex items-center gap-1">
      <NavItem
        icon={LayoutDashboard}
        label="Trocar Módulo"
        path="/dashboard"
      />
    </div>
  );
}

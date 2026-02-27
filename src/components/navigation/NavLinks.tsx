import { NavItem } from "./NavItem";
import { LayoutGrid } from "lucide-react";

export function NavLinks() {
  return (
    <div className="hidden md:flex items-center gap-1">
      <NavItem
        icon={LayoutGrid}
        label="Módulos"
        path="/modulos"
      />
    </div>
  );
}

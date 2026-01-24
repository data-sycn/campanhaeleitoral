import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
}

export function NavItem({ icon: Icon, label, path }: NavItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className="gap-2"
      onClick={() => navigate(path)}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Button>
  );
}
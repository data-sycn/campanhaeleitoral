import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  Bell
} from "lucide-react";

interface NavigationProps {
  user?: {
    name: string;
    role: 'admin' | 'candidate' | 'supporter';
    avatar?: string;
  };
}

export function Navigation({ user }: NavigationProps) {
  const roleColors = {
    admin: 'bg-destructive text-destructive-foreground',
    candidate: 'bg-primary text-primary-foreground',
    supporter: 'bg-secondary text-secondary-foreground'
  };

  const roleLabels = {
    admin: 'Administrador',
    candidate: 'Candidato',
    supporter: 'Apoiador'
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 gradient-hero rounded-md flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CampanhaGov</h1>
              <p className="text-xs text-muted-foreground">Gestão de Campanhas</p>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="gap-2">
              <DollarSign className="w-4 h-4" />
              Orçamento
            </Button>
            <Button variant="ghost" className="gap-2">
              <Users className="w-4 h-4" />
              Apoiadores
            </Button>
            <Button variant="ghost" className="gap-2">
              <FileText className="w-4 h-4" />
              Relatórios
            </Button>
          </div>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs"></span>
          </Button>

          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <Badge variant="secondary" className={roleColors[user.role]}>
                  {roleLabels[user.role]}
                </Badge>
              </div>
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xs gradient-primary text-white">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
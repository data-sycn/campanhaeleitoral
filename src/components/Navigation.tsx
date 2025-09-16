import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  Bell,
  Receipt
} from "lucide-react";

interface NavigationProps {}

export function Navigation({}: NavigationProps) {
  const { user, signOut } = useAuth();
  const handleNavigation = (path: string) => {
    window.location.href = path;
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
          {user && (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" className="gap-2" onClick={() => handleNavigation('/')}>
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="gap-2" onClick={() => handleNavigation('/budget')}>
                <DollarSign className="w-4 h-4" />
                Orçamento
              </Button>
              <Button variant="ghost" className="gap-2" onClick={() => handleNavigation('/expenses')}>
                <Receipt className="w-4 h-4" />
                Despesas
              </Button>
              <Button variant="ghost" className="gap-2" onClick={() => handleNavigation('/supporters')}>
                <Users className="w-4 h-4" />
                Apoiadores
              </Button>
              <Button variant="ghost" className="gap-2" onClick={() => handleNavigation('/reports')}>
                <FileText className="w-4 h-4" />
                Relatórios
              </Button>
            </div>
          )}
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs"></span>
              </Button>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xs gradient-primary text-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={signOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <Button variant="campaign" onClick={() => handleNavigation('/auth')}>
              Entrar
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
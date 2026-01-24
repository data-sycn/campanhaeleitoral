import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User, RefreshCcw, Building2 } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

interface NavUserMenuProps {
  user: SupabaseUser;
  onSignOut: () => void;
  selectedCandidate?: { id: string; name: string; party: string | null } | null;
  onSwitchCandidate?: () => void;
}

export function NavUserMenu({ user, onSignOut, selectedCandidate, onSwitchCandidate }: NavUserMenuProps) {
  const navigate = useNavigate();
  const userName = user.user_metadata?.name || user.email?.split("@")[0] || "Usuário";
  const userInitials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  // Master admin não mostra opção de trocar candidato
  const isMasterAdmin = user.email === "nailton.alsampaio@gmail.com";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2">
          <span className="hidden sm:block text-sm font-medium max-w-[150px] truncate">
            {userName}
          </span>
          <Avatar className="w-8 h-8">
            <AvatarImage src="" />
            <AvatarFallback className="text-xs gradient-primary text-white">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        
        {/* Mostrar candidato selecionado */}
        {selectedCandidate && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Building2 className="h-3 w-3" />
                <span>Candidato Ativo</span>
              </div>
              <p className="text-sm font-medium">{selectedCandidate.name}</p>
              {selectedCandidate.party && (
                <p className="text-xs text-muted-foreground">{selectedCandidate.party}</p>
              )}
            </div>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <User className="mr-2 h-4 w-4" />
          Meu Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          Configurações
        </DropdownMenuItem>
        
        {/* Botão Trocar Candidato - apenas se não for master admin */}
        {!isMasterAdmin && onSwitchCandidate && (
          <DropdownMenuItem onClick={onSwitchCandidate}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Trocar Candidato
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
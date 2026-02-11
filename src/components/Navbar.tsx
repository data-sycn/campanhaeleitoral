import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  NavLogo,
  NavLinks,
  NavNotifications,
  NavUserMenu,
  NavMobileMenu,
} from "./navigation/index";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <NavLogo />
          {user && <NavLinks />}
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <NavNotifications count={1} />
              <NavUserMenu user={user} onSignOut={signOut} />
              <NavMobileMenu />
            </>
          ) : (
            <Button variant="campaign" onClick={() => navigate("/auth")}>
              Entrar
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

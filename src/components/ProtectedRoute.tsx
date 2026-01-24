import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, needsCandidateSelection } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redireciona para login, mas salva a página que o usuário tentou acessar
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Se precisa selecionar candidato, redireciona
  if (needsCandidateSelection) {
    return <Navigate to="/select-candidate" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
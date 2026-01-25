import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  skipCandidateCheck?: boolean;
}

export const ProtectedRoute = ({ children, skipCandidateCheck = false }: ProtectedRouteProps) => {
  const { user, loading, needsCandidateSelection } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">Validando credenciais...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Se o usuário precisa selecionar um candidato e não estamos em uma rota que pula essa checagem
  if (needsCandidateSelection && !skipCandidateCheck) {
    console.log("ProtectedRoute: Redirecionando para seleção de candidato");
    return <Navigate to="/select-candidate" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
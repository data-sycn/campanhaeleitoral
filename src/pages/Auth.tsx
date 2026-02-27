import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/useAuth";
import { BarChart3, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handlePinComplete = async (value: string) => {
    if (value.length !== 4) return;
    setIsLoading(true);

    try {
      // Look up email by PIN
      const { data: email, error: lookupError } = await (supabase as any)
        .rpc('get_email_by_pin', { p_pin: value });

      if (lookupError || !email) {
        toast({ title: "PIN inválido", description: "Nenhum usuário encontrado com este PIN.", variant: "destructive" });
        setPin("");
        setIsLoading(false);
        return;
      }

      // PIN is the password, email was found via lookup
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: value,
      });

      if (error) {
        toast({ title: "PIN inválido", description: "Não foi possível autenticar.", variant: "destructive" });
        setPin("");
      }
    } catch {
      toast({ title: "Erro", description: "Erro ao tentar autenticar.", variant: "destructive" });
      setPin("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-16 h-16 gradient-hero rounded-2xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-9 h-9 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">CampanhaGov</h1>
            <p className="text-sm text-muted-foreground">Gestão de Campanhas</p>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Acesso ao Sistema</CardTitle>
            <CardDescription>
              Digite seu PIN de 4 dígitos para entrar
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Autenticando...</p>
              </div>
            ) : (
              <InputOTP
                maxLength={4}
                value={pin}
                onChange={(value) => {
                  setPin(value);
                  if (value.length === 4) {
                    handlePinComplete(value);
                  }
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-14 h-14 text-2xl font-bold" />
                  <InputOTPSlot index={1} className="w-14 h-14 text-2xl font-bold" />
                  <InputOTPSlot index={2} className="w-14 h-14 text-2xl font-bold" />
                  <InputOTPSlot index={3} className="w-14 h-14 text-2xl font-bold" />
                </InputOTPGroup>
              </InputOTP>
            )}
            <p className="text-xs text-muted-foreground text-center">
              Acesso restrito. Contate o administrador para obter seu PIN.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

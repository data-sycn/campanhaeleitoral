import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { BarChart3, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if device is trusted (has token in localStorage)
  const deviceToken = localStorage.getItem("device_token");
  const isTrustedDevice = !!deviceToken;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Trusted device: PIN-only login via get_email_by_pin (existing flow)
  const handlePinLogin = async (value: string) => {
    if (value.length !== 4) return;
    setIsLoading(true);

    try {
      const { data: emailResult, error: lookupError } = await (supabase as any)
        .rpc('get_email_by_pin', { p_pin: value });

      if (lookupError || !emailResult) {
        toast({ title: "PIN inválido", description: "Nenhum usuário encontrado com este PIN.", variant: "destructive" });
        setPin("");
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: emailResult,
        password: value, // PIN is still the password for now
      });

      if (error) {
        toast({ title: "PIN inválido", description: "Não foi possível autenticar.", variant: "destructive" });
        setPin("");
      } else {
        // Update last_used_at for the device
        if (deviceToken) {
          await supabase
            .from("trusted_devices")
            .update({ last_used_at: new Date().toISOString() })
            .eq("device_token", deviceToken);
        }
        sessionStorage.setItem("pin_verified", "true");
      }
    } catch {
      toast({ title: "Erro", description: "Erro ao autenticar.", variant: "destructive" });
      setPin("");
    } finally {
      setIsLoading(false);
    }
  };

  // Untrusted device: full login with email + password + PIN
  const handleFullLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || pin.length !== 4) {
      toast({ title: "Preencha todos os campos", description: "E-mail, senha e PIN são obrigatórios.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    try {
      // Authenticate with real password
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({ title: "Credenciais inválidas", description: "Verifique e-mail, senha e PIN.", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      // Validate PIN via RPC
      const { data: pinValid } = await supabase.rpc("validate_pin", { p_pin: pin });
      if (!pinValid) {
        toast({ title: "PIN inválido", variant: "destructive" });
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      // Register device as trusted
      const newToken = crypto.randomUUID();
      const deviceName = navigator.userAgent.slice(0, 100);
      await supabase.from("trusted_devices").insert({
        user_id: (await supabase.auth.getUser()).data.user!.id,
        device_token: newToken,
        device_name: deviceName,
      });
      localStorage.setItem("device_token", newToken);
      sessionStorage.setItem("pin_verified", "true");

      toast({ title: "Dispositivo registrado", description: "Este dispositivo agora é confiável." });
    } catch {
      toast({ title: "Erro", description: "Erro ao autenticar.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-elevated">
            <BarChart3 className="w-9 h-9 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">CampanhaGov</h1>
            <p className="text-sm text-muted-foreground">Gestão de Campanhas</p>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>{isTrustedDevice ? "Acesso Rápido" : "Acesso ao Sistema"}</CardTitle>
            <CardDescription>
              {isTrustedDevice
                ? "Dispositivo reconhecido. Digite seu PIN."
                : "Primeiro acesso neste dispositivo"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Autenticando...</p>
              </div>
            ) : isTrustedDevice ? (
              /* Trusted device: PIN only */
              <div className="flex flex-col items-center gap-6">
                <InputOTP
                  maxLength={4}
                  value={pin}
                  onChange={(value) => {
                    setPin(value);
                    if (value.length === 4) handlePinLogin(value);
                  }}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-14 h-14 text-2xl font-bold" />
                    <InputOTPSlot index={1} className="w-14 h-14 text-2xl font-bold" />
                    <InputOTPSlot index={2} className="w-14 h-14 text-2xl font-bold" />
                    <InputOTPSlot index={3} className="w-14 h-14 text-2xl font-bold" />
                  </InputOTPGroup>
                </InputOTP>
                <button
                  onClick={() => { localStorage.removeItem("device_token"); window.location.reload(); }}
                  className="text-xs text-muted-foreground underline"
                >
                  Usar outro dispositivo
                </button>
              </div>
            ) : (
              /* Untrusted device: full login */
              <form onSubmit={handleFullLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>PIN de 4 dígitos</Label>
                  <div className="flex justify-center">
                    <InputOTP maxLength={4} value={pin} onChange={setPin}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-12 h-12 text-xl font-bold" />
                        <InputOTPSlot index={1} className="w-12 h-12 text-xl font-bold" />
                        <InputOTPSlot index={2} className="w-12 h-12 text-xl font-bold" />
                        <InputOTPSlot index={3} className="w-12 h-12 text-xl font-bold" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={pin.length !== 4}>
                  Entrar e Registrar Dispositivo
                </Button>
              </form>
            )}
            <p className="text-xs text-muted-foreground text-center mt-4">
              Acesso restrito. Contate o administrador.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

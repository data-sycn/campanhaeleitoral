import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PinGateProps {
  onSuccess: () => void;
}

export const PinGate = ({ onSuccess }: PinGateProps) => {
  const { toast } = useToast();
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePinComplete = async (value: string) => {
    if (value.length !== 4) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.rpc("validate_pin", { p_pin: value });

      if (error || !data) {
        toast({ title: "PIN inválido", description: "O PIN digitado está incorreto.", variant: "destructive" });
        setPin("");
        setIsLoading(false);
        return;
      }

      // Mark PIN as verified in sessionStorage (resets when tab closes)
      sessionStorage.setItem("pin_verified", "true");
      onSuccess();
    } catch {
      toast({ title: "Erro", description: "Erro ao validar PIN.", variant: "destructive" });
      setPin("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <Lock className="w-9 h-9 text-primary-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Sessão protegida</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Verificação de PIN</CardTitle>
            <CardDescription>
              Digite seu PIN de 4 dígitos para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Validando...</p>
              </div>
            ) : (
              <InputOTP
                maxLength={4}
                value={pin}
                onChange={(value) => {
                  setPin(value);
                  if (value.length === 4) handlePinComplete(value);
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download, Smartphone, Share, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Install = () => {
  const { canInstall, isInstalled, isIOS, install } = usePWAInstall();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-3">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Smartphone className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Instalar CampanhaGov</h1>
          <p className="text-muted-foreground">
            Instale o app no seu celular para acesso rápido, mesmo offline.
          </p>
        </div>

        {isInstalled ? (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
            <p className="text-foreground font-medium">App já está instalado!</p>
            <p className="text-sm text-muted-foreground">
              Procure o ícone do CampanhaGov na sua tela inicial.
            </p>
          </div>
        ) : canInstall ? (
          <div className="space-y-4">
            <Button onClick={install} size="lg" className="w-full gap-2">
              <Download className="w-5 h-5" />
              Instalar agora
            </Button>
            <p className="text-xs text-muted-foreground">
              O app será adicionado à sua tela inicial
            </p>
          </div>
        ) : isIOS ? (
          <div className="rounded-xl border bg-card p-6 space-y-4 text-left">
            <p className="font-medium text-foreground text-center">Como instalar no iPhone:</p>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                <span>Toque no botão <Share className="inline w-4 h-4 text-primary" /> <strong>Compartilhar</strong> na barra inferior do Safari</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                <span>Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong></span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
                <span>Toque em <strong>"Adicionar"</strong> no canto superior direito</span>
              </li>
            </ol>
          </div>
        ) : (
          <div className="rounded-xl border bg-card p-6 space-y-4 text-left">
            <p className="font-medium text-foreground text-center">Como instalar no Android:</p>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                <span>Abra este site no <strong>Google Chrome</strong></span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                <span>Toque no menu <strong>⋮</strong> (três pontos) no canto superior direito</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
                <span>Toque em <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong></span>
              </li>
            </ol>
          </div>
        )}

        <a href="/auth" className="block text-sm text-primary hover:underline mt-4">
          ← Voltar para o app
        </a>
      </div>
    </div>
  );
};

export default Install;

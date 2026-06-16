import { useEffect, useState } from "react";
import { Download, Share, MoreVertical, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DeferredPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window {
    __deferredInstallPrompt: DeferredPromptEvent | null;
  }
}

function isIOSSafari() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /AppleWebKit/.test(ua) && !/CriOS/.test(ua) && !/GSAiOS/.test(ua);
  return isIOS && isSafari;
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

interface InstallAppButtonProps {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onAfterClick?: () => void;
}

export function InstallAppButton({
  variant = "outline",
  size = "sm",
  className,
  onAfterClick,
}: InstallAppButtonProps) {
  const [canPrompt, setCanPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());
    setCanPrompt(!!window.__deferredInstallPrompt);

    const onInstallable = () => setCanPrompt(true);
    const onInstalled = () => {
      setInstalled(true);
      setCanPrompt(false);
    };
    window.addEventListener("pwa-installable", onInstallable);
    window.addEventListener("pwa-installed", onInstalled);
    return () => {
      window.removeEventListener("pwa-installable", onInstallable);
      window.removeEventListener("pwa-installed", onInstalled);
    };
  }, []);

  if (installed) return null;

  const handleClick = async () => {
    const prompt = window.__deferredInstallPrompt;
    if (prompt) {
      await prompt.prompt();
      await prompt.userChoice;
      window.__deferredInstallPrompt = null;
      setCanPrompt(false);
      onAfterClick?.();
      return;
    }
    // No native prompt available — show manual install instructions.
    setHelpOpen(true);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
      >
        <Download className="h-4 w-4 mr-2" />
        Instalar app
      </Button>

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Instalar o Açaí BH</DialogTitle>
            <DialogDescription>
              Siga as instruções de acordo com o seu aparelho.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 text-sm">
            <div>
              <h4 className="font-semibold mb-2">📱 iPhone / iPad (Safari)</h4>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>
                  Toque no botão <strong>Compartilhar</strong>{" "}
                  <Share className="inline h-4 w-4 align-text-bottom" /> na barra
                  inferior do Safari.
                </li>
                <li>
                  Escolha <strong>Adicionar à Tela de Início</strong>{" "}
                  <Plus className="inline h-4 w-4 align-text-bottom" />.
                </li>
                <li>Toque em <strong>Adicionar</strong> no canto superior direito.</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">🤖 Android (Chrome)</h4>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>
                  Toque no menu <MoreVertical className="inline h-4 w-4 align-text-bottom" />{" "}
                  no canto superior direito.
                </li>
                <li>
                  Escolha <strong>Instalar app</strong> ou{" "}
                  <strong>Adicionar à tela inicial</strong>.
                </li>
                <li>Confirme em <strong>Instalar</strong>.</li>
              </ol>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
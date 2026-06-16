import { useEffect, useState } from "react";
import { Download, Share } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
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
}

export function InstallAppButton({
  variant = "outline",
  size = "sm",
  className,
}: InstallAppButtonProps) {
  const [canPrompt, setCanPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [iosOpen, setIosOpen] = useState(false);

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

  const ios = isIOSSafari();

  const handleClick = async () => {
    if (ios) {
      setIosOpen(true);
      return;
    }
    const prompt = window.__deferredInstallPrompt;
    if (!prompt) return;
    await prompt.prompt();
    await prompt.userChoice;
    window.__deferredInstallPrompt = null;
    setCanPrompt(false);
  };

  // On non-iOS, hide if the browser hasn't fired beforeinstallprompt yet
  if (!ios && !canPrompt) return null;

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

      <Dialog open={iosOpen} onOpenChange={setIosOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Instalar Açaí BH no iPhone</DialogTitle>
            <DialogDescription>
              No Safari, toque no botão <strong>Compartilhar</strong>{" "}
              <Share className="inline h-4 w-4" /> e em seguida em{" "}
              <strong>Adicionar à Tela de Início</strong>.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
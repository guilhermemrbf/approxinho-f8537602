import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useToast } from "@/hooks/use-toast";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const { toast } = useToast();
  
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast({ title: "Digite a senha", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    // Simula delay de autenticação
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const success = login(password);
    
    if (success) {
      toast({ title: "Bem-vindo!", description: "Acesso administrativo liberado" });
      navigate("/admin/pedidos");
    } else {
      toast({ title: "Senha incorreta", variant: "destructive" });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl border shadow-card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Área Administrativa</h1>
            <p className="text-muted-foreground mt-1">Q!delícia Delivery</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">Senha de Acesso</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite a senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                "Verificando..."
              ) : (
                <>
                  Entrar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Acesso restrito a funcionários autorizados
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;

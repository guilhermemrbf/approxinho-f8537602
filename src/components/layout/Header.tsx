import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Phone, Clock, MapPin, User } from "lucide-react";
import logoAcaiBH from "@/assets/acai-bh-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { businessInfo } from "@/data/menu";

const navLinks = [
  { path: "/", label: "Início" },
  { path: "/cardapio", label: "Cardápio" },
  { path: "/montar", label: "Monte seu Açaí" },
  { path: "/pedidos", label: "Meus Pedidos" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems, totalPrice } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar com informações */}
      <div className="hidden bg-secondary text-secondary-foreground py-2 md:block">
        <div className="container flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {businessInfo.hours}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {businessInfo.address}
            </span>
          </div>
          <a 
            href={`https://wa.me/${businessInfo.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-semibold hover:text-primary transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            {businessInfo.phone}
          </a>
        </div>
      </div>

      {/* Main header */}
      <div className="glass border-b">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoAcaiBH.url}
              alt="Açaí BH"
              className="h-11 w-11 object-contain"
            />
            <div>
              <h1 className="text-lg font-extrabold leading-none">
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-açai)' }}>Açaí</span>{" "}
                <span className="text-foreground">BH</span>
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Delivery</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={location.pathname === link.path || location.pathname.startsWith(link.path + "/") ? "default" : "ghost"}
                  size="sm"
                  className="relative gap-1.5"
                >
                  {link.label}
                  {(location.pathname === link.path || location.pathname.startsWith(link.path + "/")) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg bg-primary -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden sm:block">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            
            <Link to="/carrinho">
              <Button variant="outline" size="sm" className="relative gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">
                  R$ {totalPrice.toFixed(2).replace(".", ",")}
                </span>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-b shadow-lg"
          >
            <nav className="container py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button
                    variant={location.pathname === link.path || location.pathname.startsWith(link.path + "/") ? "default" : "ghost"}
                    className="w-full justify-start gap-2"
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
              <hr className="my-2" />
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <User className="h-4 w-4" />
                  Entrar / Cadastrar
                </Button>
              </Link>
              <div className="mt-2 p-3 rounded-lg bg-muted text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5 mb-1">
                  <Clock className="h-3 w-3" />
                  {businessInfo.hours}
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3" />
                  {businessInfo.phone}
                </p>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

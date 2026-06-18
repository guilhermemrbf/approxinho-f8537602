import { Link, useLocation } from "react-router-dom";
import { Home, UtensilsCrossed, Sparkles, ShoppingBag, ClipboardList } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/", label: "Início", icon: Home },
  { path: "/cardapio", label: "Cardápio", icon: UtensilsCrossed },
  { path: "/montar", label: "Montar", icon: Sparkles, highlight: true },
  { path: "/carrinho", label: "Carrinho", icon: ShoppingBag, badge: "cart" as const },
  { path: "/pedidos", label: "Pedidos", icon: ClipboardList },
];

export function BottomNav() {
  const location = useLocation();
  const { totalItems } = useCart();

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 safe-area-bottom"
      aria-label="Navegação principal"
    >
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          const Icon = tab.icon;
          return (
            <li key={tab.path} className="flex">
              <Link
                to={tab.path}
                className={cn(
                  "relative flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.highlight ? (
                  <span
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-full shadow-lg -mt-5 gradient-açai text-primary-foreground",
                      active && "ring-2 ring-primary/40"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                ) : (
                  <span className="relative">
                    <Icon className="h-5 w-5" />
                    {tab.badge === "cart" && totalItems > 0 && (
                      <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                        {totalItems}
                      </span>
                    )}
                  </span>
                )}
                <span className="leading-none">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { businessInfo } from "@/data/menu";

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Seu carrinho está vazio
          </h1>
          <p className="text-muted-foreground mb-8">
            Que tal montar um açaí delicioso?
          </p>
          <Link to="/montar">
            <Button variant="hero" size="lg">
              Monte seu Açaí
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const deliveryFee = businessInfo.deliveryFee;
  const grandTotal = totalPrice + deliveryFee;

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">Carrinho</h1>
          <Button variant="ghost" size="sm" onClick={clearCart}>
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border shadow-card p-4"
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="h-16 w-16 rounded-xl gradient-açai flex items-center justify-center text-2xl flex-shrink-0">
                    {item.flavor.icon}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground">{item.flavor.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.size.name} ({item.size.ml}ml)
                    </p>

                    {/* Additions */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.complements.slice(0, 3).map((c) => (
                        <span
                          key={c.id}
                          className="text-xs px-2 py-0.5 rounded-full bg-muted"
                        >
                          {c.icon}
                        </span>
                      ))}
                      {item.toppings.slice(0, 2).map((t) => (
                        <span
                          key={t.id}
                          className="text-xs px-2 py-0.5 rounded-full bg-muted"
                        >
                          {t.icon}
                        </span>
                      ))}
                      {item.fruits.map((f) => (
                        <span
                          key={f.id}
                          className="text-xs px-2 py-0.5 rounded-full bg-muted"
                        >
                          {f.icon}
                        </span>
                      ))}
                      {(item.complements.length > 3 ||
                        item.toppings.length > 2) && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          +{item.complements.length - 3 + item.toppings.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Quantity */}
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center font-bold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <p className="font-bold text-primary">
                      R$ {(item.totalPrice * item.quantity).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            <Link to="/montar">
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar mais itens
              </Button>
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-2xl border shadow-card p-6 space-y-4">
              <h2 className="font-bold text-lg">Resumo do Pedido</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxa de entrega</span>
                  <span>R$ {deliveryFee.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>

              <hr />

              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="text-2xl font-extrabold text-primary">
                  R$ {grandTotal.toFixed(2).replace(".", ",")}
                </span>
              </div>

              <Link to="/checkout" className="block">
                <Button variant="hero" size="lg" className="w-full">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Finalizar Pedido
                </Button>
              </Link>

              <a
                href={`https://wa.me/${businessInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" size="lg" className="w-full">
                  Pedir pelo WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

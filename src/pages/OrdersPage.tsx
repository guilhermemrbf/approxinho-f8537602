import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const mockOrders = [
  {
    id: "12345",
    date: "29/01/2024 18:30",
    status: "delivered",
    items: [
      { name: "Açaí + Morango", size: "500ml", quantity: 2 },
    ],
    total: 58.0,
  },
  {
    id: "12344",
    date: "28/01/2024 19:15",
    status: "preparing",
    items: [
      { name: "Açaí c/ Leitinho", size: "700ml", quantity: 1 },
    ],
    total: 32.0,
  },
];

const statusConfig = {
  pending: { label: "Pendente", icon: Clock, color: "text-warning" },
  preparing: { label: "Preparando", icon: Package, color: "text-info" },
  delivering: { label: "Em entrega", icon: Truck, color: "text-primary" },
  delivered: { label: "Entregue", icon: CheckCircle, color: "text-success" },
};

const OrdersPage = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-8">
            Meus Pedidos
          </h1>

          {mockOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Nenhum pedido ainda
              </h2>
              <p className="text-muted-foreground mb-6">
                Faça seu primeiro pedido agora!
              </p>
              <Link to="/montar">
                <Button variant="hero">Monte seu Açaí</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {mockOrders.map((order, index) => {
                const status = statusConfig[order.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-2xl border shadow-card p-5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Pedido #{order.id}
                        </p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 ${status.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">{status.label}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>
                            {item.quantity}x {item.name} ({item.size})
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="font-medium">Total</span>
                      <span className="font-bold text-primary">
                        R$ {order.total.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OrdersPage;

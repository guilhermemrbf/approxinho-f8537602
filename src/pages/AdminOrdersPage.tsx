import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Clock, CheckCircle, Truck, Package, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

type OrderStatus = "pending" | "preparing" | "ready" | "delivering" | "delivered";

interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  items: string[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  paymentMethod: string;
}

// Mock de pedidos - será substituído por dados reais do banco
const mockOrders: Order[] = [
  {
    id: "001",
    customer: "João Silva",
    phone: "(74) 99999-1234",
    address: "Rua das Flores, 123",
    items: ["Açaí 500ml + Morango", "Açaí 300ml Tradicional"],
    total: 52.00,
    status: "pending",
    createdAt: new Date(Date.now() - 5 * 60000),
    paymentMethod: "PIX",
  },
  {
    id: "002",
    customer: "Maria Santos",
    phone: "(74) 98888-5678",
    address: "Av. Principal, 456",
    items: ["Açaí 700ml c/ Nutella"],
    total: 38.00,
    status: "preparing",
    createdAt: new Date(Date.now() - 15 * 60000),
    paymentMethod: "Cartão",
  },
  {
    id: "003",
    customer: "Pedro Costa",
    phone: "(74) 97777-9012",
    address: "Rua do Comércio, 789",
    items: ["Açaí 500ml Especial", "Açaí 500ml Tropical"],
    total: 64.00,
    status: "ready",
    createdAt: new Date(Date.now() - 25 * 60000),
    paymentMethod: "Dinheiro",
  },
];

const statusConfig = {
  pending: { label: "Novo", color: "bg-yellow-500", icon: Clock },
  preparing: { label: "Preparando", color: "bg-blue-500", icon: Package },
  ready: { label: "Pronto", color: "bg-green-500", icon: CheckCircle },
  delivering: { label: "Saiu p/ Entrega", color: "bg-purple-500", icon: Truck },
  delivered: { label: "Entregue", color: "bg-gray-500", icon: CheckCircle },
};

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const flow: OrderStatus[] = ["pending", "preparing", "ready", "delivering", "delivered"];
    const currentIndex = flow.indexOf(currentStatus);
    return currentIndex < flow.length - 1 ? flow[currentIndex + 1] : null;
  };

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter((o) => o.status === filter);

  const formatTime = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}min atrás`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}min`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Painel de Pedidos</h1>
            <p className="text-sm text-muted-foreground">Q!delícia Delivery</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setOrders([...mockOrders])}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        {/* Filtros */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Todos ({orders.length})
          </Button>
          {(Object.keys(statusConfig) as OrderStatus[]).map((status) => {
            const config = statusConfig[status];
            const count = orders.filter((o) => o.status === status).length;
            return (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {config.label} ({count})
              </Button>
            );
          })}
        </div>

        {/* Lista de Pedidos */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order, index) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            const nextStatus = getNextStatus(order.status);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-2xl border shadow-card p-4"
              >
                {/* Header do Pedido */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">#{order.id}</span>
                      <Badge className={`${config.color} text-white`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{formatTime(order.createdAt)}</p>
                  </div>
                  <span className="font-bold text-primary text-lg">
                    R$ {order.total.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                {/* Cliente */}
                <div className="space-y-1 mb-3">
                  <p className="font-semibold">{order.customer}</p>
                  <p className="text-sm text-muted-foreground">{order.phone}</p>
                  <p className="text-sm text-muted-foreground">{order.address}</p>
                </div>

                {/* Itens */}
                <div className="bg-muted/50 rounded-lg p-3 mb-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">ITENS</p>
                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm">• {item}</p>
                  ))}
                </div>

                {/* Pagamento */}
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-muted-foreground">Pagamento:</span>
                  <Badge variant="outline">{order.paymentMethod}</Badge>
                </div>

                {/* Ações */}
                {nextStatus && (
                  <Button
                    variant="hero"
                    size="sm"
                    className="w-full"
                    onClick={() => updateOrderStatus(order.id, nextStatus)}
                  >
                    Marcar como {statusConfig[nextStatus].label}
                  </Button>
                )}
              </motion.div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum pedido encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, RefreshCw, Bell, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { StatusFilter } from "@/components/admin/StatusFilter";
import { OrderCard } from "@/components/admin/OrderCard";

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
    address: "Rua das Flores, 123 - Centro",
    items: ["Açaí 500ml + Morango + Leite Ninho", "Açaí 300ml Tradicional"],
    total: 52.00,
    status: "pending",
    createdAt: new Date(Date.now() - 5 * 60000),
    paymentMethod: "PIX",
  },
  {
    id: "002",
    customer: "Maria Santos",
    phone: "(74) 98888-5678",
    address: "Av. Principal, 456 - Bairro Novo",
    items: ["Açaí 700ml c/ Nutella + Banana"],
    total: 38.00,
    status: "preparing",
    createdAt: new Date(Date.now() - 15 * 60000),
    paymentMethod: "Cartão",
  },
  {
    id: "003",
    customer: "Pedro Costa",
    phone: "(74) 97777-9012",
    address: "Rua do Comércio, 789 - Centro",
    items: ["Açaí 500ml Especial", "Açaí 500ml Tropical + Granola"],
    total: 64.00,
    status: "ready",
    createdAt: new Date(Date.now() - 25 * 60000),
    paymentMethod: "Dinheiro",
  },
  {
    id: "004",
    customer: "Ana Paula",
    phone: "(74) 96666-3456",
    address: "Rua Nova, 321 - Jardim",
    items: ["Açaí 1L Família + Todos os Complementos"],
    total: 75.00,
    status: "delivering",
    createdAt: new Date(Date.now() - 45 * 60000),
    paymentMethod: "PIX",
  },
  {
    id: "005",
    customer: "Carlos Souza",
    phone: "(74) 95555-7890",
    address: "Av. Brasil, 100 - Centro",
    items: ["Açaí 300ml Simples"],
    total: 18.00,
    status: "delivered",
    createdAt: new Date(Date.now() - 90 * 60000),
    paymentMethod: "Dinheiro",
  },
];

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [soundEnabled, setSoundEnabled] = useState(true);

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

  const orderCounts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      preparing: orders.filter((o) => o.status === "preparing").length,
      ready: orders.filter((o) => o.status === "ready").length,
      delivering: orders.filter((o) => o.status === "delivering").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const filtered = filter === "all" 
      ? orders 
      : orders.filter((o) => o.status === filter);
    
    // Ordenar: pendentes primeiro, depois por data mais recente
    return filtered.sort((a, b) => {
      const statusPriority: Record<OrderStatus, number> = {
        pending: 0,
        preparing: 1,
        ready: 2,
        delivering: 3,
        delivered: 4,
      };
      
      if (statusPriority[a.status] !== statusPriority[b.status]) {
        return statusPriority[a.status] - statusPriority[b.status];
      }
      
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }, [orders, filter]);

  const pendingCount = orderCounts.pending;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Fixo */}
      <header className="sticky top-0 z-50 bg-card border-b-2 border-primary/20 shadow-lg">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-xl font-bold text-primary-foreground shadow-md">
                Q!
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                  Painel de Pedidos
                  {pendingCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500 text-white text-sm"
                    >
                      <Bell className="h-3.5 w-3.5" />
                      {pendingCount} {pendingCount === 1 ? "novo" : "novos"}
                    </motion.span>
                  )}
                </h1>
                <p className="text-sm text-muted-foreground">Q!delícia Pizzaria & Esfiharia</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? "Som ativado" : "Som desativado"}
              >
                <Volume2 className={`h-4 w-4 ${soundEnabled ? "text-primary" : "text-muted-foreground"}`} />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setOrders([...mockOrders])}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {/* Instruções Rápidas */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20"
        >
          <h2 className="font-semibold text-foreground mb-2">📋 Como usar o painel:</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li><span className="text-yellow-600 font-medium">🔴 Novos pedidos</span> aparecem primeiro e piscam para chamar atenção</li>
            <li>Clique no botão de ação para <span className="font-medium">avançar o status</span> do pedido</li>
            <li>Use os <span className="font-medium">filtros</span> abaixo para ver apenas pedidos específicos</li>
            <li>O fluxo é: <span className="font-medium">Novo → Preparando → Pronto → Em Rota → Entregue</span></li>
          </ul>
        </motion.div>

        {/* Dashboard Stats */}
        <DashboardStats orders={orders} />

        {/* Filtros */}
        <div className="mb-6">
          <StatusFilter 
            currentFilter={filter} 
            onFilterChange={setFilter} 
            orderCounts={orderCounts}
          />
        </div>

        {/* Grid de Pedidos */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredOrders.map((order, index) => (
            <OrderCard
              key={order.id}
              order={order}
              index={index}
              onUpdateStatus={updateOrderStatus}
            />
          ))}
        </div>

        {/* Estado Vazio */}
        {filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Nenhum pedido encontrado</h3>
            <p className="text-muted-foreground">
              {filter === "all" 
                ? "Aguardando novos pedidos..." 
                : `Não há pedidos com status "${filter}"`
              }
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminOrdersPage;

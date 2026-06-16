import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, RefreshCw, Bell, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { StatusFilter } from "@/components/admin/StatusFilter";
import { OrderCard } from "@/components/admin/OrderCard";
import { useOrders, OrderStatus, Order } from "@/hooks/useOrders";

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { orders, loading, fetchOrders, updateOrderStatus } = useOrders();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
  };

  // Play notification sound for new orders
  useEffect(() => {
    const handleNewOrder = () => {
      if (soundEnabled && audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
    };

    window.addEventListener("new-order", handleNewOrder);
    return () => window.removeEventListener("new-order", handleNewOrder);
  }, [soundEnabled]);

  const orderCounts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      preparing: orders.filter((o) => o.status === "preparing").length,
      ready: orders.filter((o) => o.status === "ready").length,
      delivering: orders.filter((o) => o.status === "delivering").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
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
        cancelled: 5,
      };
      
      if (statusPriority[a.status] !== statusPriority[b.status]) {
        return statusPriority[a.status] - statusPriority[b.status];
      }
      
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [orders, filter]);

  const pendingCount = orderCounts.pending;

  // Transform orders for DashboardStats component
  const statsOrders = useMemo(() => {
    return orders.map((order) => ({
      id: order.id,
      customer: order.customer_name,
      phone: order.customer_phone,
      address: order.delivery_address,
      items: order.items.map((item) => `${item.name} ${item.size}`),
      total: order.total,
      status: order.status as "pending" | "preparing" | "ready" | "delivering" | "delivered",
      createdAt: new Date(order.created_at),
      paymentMethod: order.payment_method === "pix" ? "PIX" : order.payment_method === "card" ? "Cartão" : "Dinheiro",
    }));
  }, [orders]);

  return (
    <div className="min-h-screen bg-background">
      {/* Notification Sound */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleVcxQZfK5Ly" type="audio/wav" />
      </audio>

      {/* Header Fixo */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-primary/80 shadow-xl">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-xl font-bold text-white shadow-lg border border-white/30">
                Q!
              </div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  Painel de Pedidos
                  {pendingCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-sm font-bold shadow-md"
                    >
                      <Bell className="h-3.5 w-3.5" />
                      {pendingCount} {pendingCount === 1 ? "novo" : "novos"}
                    </motion.span>
                  )}
                </h1>
                <p className="text-sm text-white/80">
                  Roxinho
                  <span className="ml-2 inline-flex items-center gap-1 text-xs text-green-300">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                    Sincronizado em tempo real
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? "Som ativado" : "Som desativado"}
                className="text-white hover:bg-white/20"
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => fetchOrders()}
                className="gap-2 text-white hover:bg-white/20"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="gap-2 text-white hover:bg-red-500/30"
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
          className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-sm"
        >
          <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">📋</span>
            Como usar o painel
          </h2>
          <ul className="text-sm text-muted-foreground space-y-2 ml-10">
            <li className="flex items-start gap-2"><span className="text-yellow-500">●</span> <span><strong className="text-yellow-600">Novos pedidos</strong> aparecem primeiro com destaque amarelo</span></li>
            <li className="flex items-start gap-2"><span className="text-primary">●</span> <span>Clique no <strong>botão roxo</strong> para avançar o status do pedido</span></li>
            <li className="flex items-start gap-2"><span className="text-blue-500">●</span> <span>Fluxo: <strong>Novo → Preparando → Pronto → Em Rota → Entregue</strong></span></li>
          </ul>
        </motion.div>

        {/* Dashboard Stats */}
        <DashboardStats orders={statsOrders} />

        {/* Filtros */}
        <div className="mb-6">
          <StatusFilter 
            currentFilter={filter} 
            onFilterChange={setFilter} 
            orderCounts={orderCounts}
          />
        </div>

        {/* Loading State */}
        {loading && orders.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Carregando pedidos...</span>
          </div>
        )}

        {/* Grid de Pedidos */}
        {!loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredOrders.map((order, index) => (
              <OrderCard
                key={order.id}
                order={{
                  id: order.id,
                  orderNumber: order.order_number,
                  customer: order.customer_name,
                  phone: order.customer_phone,
                  address: order.delivery_address + (order.address_complement ? ` - ${order.address_complement}` : ""),
                  items: order.items.map((item) => 
                    `${item.name} ${item.size}${item.details ? ` + ${item.details}` : ""}`
                  ),
                  total: order.total,
                  status: order.status as "pending" | "preparing" | "ready" | "delivering" | "delivered" | "cancelled",
                  createdAt: new Date(order.created_at),
                  paymentMethod: order.payment_method === "pix" ? "PIX" : order.payment_method === "card" ? "Cartão" : "Dinheiro",
                  notes: order.notes || undefined,
                }}
                index={index}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}

        {/* Estado Vazio */}
        {!loading && filteredOrders.length === 0 && (
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

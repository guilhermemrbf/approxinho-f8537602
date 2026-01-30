import { motion } from "framer-motion";
import { Clock, Package, CheckCircle, Truck, Phone, MapPin, CreditCard, Banknote, QrCode, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

interface OrderCardProps {
  order: Order;
  index: number;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const statusConfig = {
  pending: { 
    label: "🔴 Novo Pedido", 
    color: "bg-yellow-500", 
    icon: Clock,
    nextLabel: "Iniciar Preparo",
    nextIcon: Package,
  },
  preparing: { 
    label: "🟡 Preparando", 
    color: "bg-blue-500", 
    icon: Package,
    nextLabel: "Marcar como Pronto",
    nextIcon: CheckCircle,
  },
  ready: { 
    label: "🟢 Pronto", 
    color: "bg-green-500", 
    icon: CheckCircle,
    nextLabel: "Saiu para Entrega",
    nextIcon: Truck,
  },
  delivering: { 
    label: "🚀 Em Rota", 
    color: "bg-purple-500", 
    icon: Truck,
    nextLabel: "Confirmar Entrega",
    nextIcon: CheckCircle,
  },
  delivered: { 
    label: "✅ Entregue", 
    color: "bg-gray-500", 
    icon: CheckCircle,
    nextLabel: null,
    nextIcon: null,
  },
};

const paymentIcons: Record<string, typeof CreditCard> = {
  "PIX": QrCode,
  "Cartão": CreditCard,
  "Dinheiro": Banknote,
};

export function OrderCard({ order, index, onUpdateStatus }: OrderCardProps) {
  const config = statusConfig[order.status];
  const StatusIcon = config.icon;
  const PaymentIcon = paymentIcons[order.paymentMethod] || CreditCard;

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const flow: OrderStatus[] = ["pending", "preparing", "ready", "delivering", "delivered"];
    const currentIndex = flow.indexOf(currentStatus);
    return currentIndex < flow.length - 1 ? flow[currentIndex + 1] : null;
  };

  const nextStatus = getNextStatus(order.status);

  const formatTime = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return "Agora mesmo";
    if (minutes < 60) return `Há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `Há ${hours}h ${minutes % 60}min`;
  };

  const isUrgent = order.status === "pending";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
      className={`bg-card rounded-2xl border-2 shadow-lg overflow-hidden ${
        isUrgent ? "border-yellow-400 ring-2 ring-yellow-200" : "border-border"
      }`}
    >
      {/* Status Header */}
      <div className={`${config.color} px-4 py-2 flex items-center justify-between`}>
        <div className="flex items-center gap-2 text-white">
          <StatusIcon className="h-4 w-4" />
          <span className="font-semibold text-sm">{config.label}</span>
        </div>
        <span className="text-white/90 text-xs font-medium">
          #{order.id}
        </span>
      </div>

      <div className="p-4">
        {/* Tempo */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-medium ${isUrgent ? "text-yellow-600" : "text-muted-foreground"}`}>
            ⏱️ {formatTime(order.createdAt)}
          </span>
          <span className="text-lg font-bold text-primary">
            R$ {order.total.toFixed(2).replace(".", ",")}
          </span>
        </div>

        {/* Cliente */}
        <div className="space-y-2 mb-4">
          <p className="font-bold text-foreground text-lg">{order.customer}</p>
          <a 
            href={`tel:${order.phone}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            {order.phone}
          </a>
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            {order.address}
          </p>
        </div>

        {/* Itens */}
        <div className="bg-muted/50 rounded-xl p-3 mb-4">
          <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">
            📦 Itens do Pedido
          </p>
          <ul className="space-y-1">
            {order.items.map((item, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-primary">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Pagamento */}
        <div className="flex items-center justify-between mb-4 p-2 bg-secondary/30 rounded-lg">
          <span className="text-sm text-muted-foreground">Pagamento:</span>
          <Badge variant="outline" className="flex items-center gap-1.5">
            <PaymentIcon className="h-3.5 w-3.5" />
            {order.paymentMethod}
          </Badge>
        </div>

        {/* Ação Principal */}
        {nextStatus && config.nextLabel && (
          <Button
            variant="hero"
            size="lg"
            className="w-full font-bold text-base gap-2"
            onClick={() => onUpdateStatus(order.id, nextStatus)}
          >
            {config.nextIcon && <config.nextIcon className="h-5 w-5" />}
            {config.nextLabel}
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
        )}

        {order.status === "delivered" && (
          <div className="text-center py-2">
            <Badge variant="secondary" className="text-sm">
              ✅ Pedido Finalizado
            </Badge>
          </div>
        )}
      </div>
    </motion.div>
  );
}

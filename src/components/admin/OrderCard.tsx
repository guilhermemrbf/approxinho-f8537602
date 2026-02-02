import { motion } from "framer-motion";
import { Clock, Package, CheckCircle, Truck, Phone, MapPin, CreditCard, Banknote, QrCode, ArrowRight } from "lucide-react";
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
    label: "Novo Pedido", 
    emoji: "🔴",
    gradient: "from-yellow-500 to-orange-500",
    bgLight: "bg-yellow-50",
    icon: Clock,
    nextLabel: "Iniciar Preparo",
    nextIcon: Package,
  },
  preparing: { 
    label: "Preparando", 
    emoji: "🟡",
    gradient: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50",
    icon: Package,
    nextLabel: "Marcar Pronto",
    nextIcon: CheckCircle,
  },
  ready: { 
    label: "Pronto", 
    emoji: "🟢",
    gradient: "from-green-500 to-emerald-500",
    bgLight: "bg-green-50",
    icon: CheckCircle,
    nextLabel: "Saiu p/ Entrega",
    nextIcon: Truck,
  },
  delivering: { 
    label: "Em Rota", 
    emoji: "🚀",
    gradient: "from-purple-500 to-pink-500",
    bgLight: "bg-purple-50",
    icon: Truck,
    nextLabel: "Confirmar Entrega",
    nextIcon: CheckCircle,
  },
  delivered: { 
    label: "Entregue", 
    emoji: "✅",
    gradient: "from-gray-400 to-gray-500",
    bgLight: "bg-gray-50",
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
    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h${minutes % 60}min`;
  };

  const isUrgent = order.status === "pending";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
      className={`bg-card rounded-2xl border-2 shadow-lg overflow-hidden transition-all hover:shadow-xl ${
        isUrgent ? "border-yellow-400 ring-2 ring-yellow-200 shadow-yellow-100" : "border-border"
      }`}
    >
      {/* Status Header */}
      <div className={`bg-gradient-to-r ${config.gradient} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2 text-white">
          <StatusIcon className="h-4 w-4" />
          <span className="font-bold text-sm">{config.emoji} {config.label}</span>
        </div>
        <Badge variant="secondary" className="bg-white/20 text-white border-0 font-mono text-xs">
          #{order.id.slice(0, 6)}
        </Badge>
      </div>

      <div className="p-4">
        {/* Tempo e Valor */}
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className={`${isUrgent ? "border-yellow-400 text-yellow-600 bg-yellow-50" : "border-muted"}`}>
            ⏱️ {formatTime(order.createdAt)}
          </Badge>
          <span className="text-xl font-bold text-primary">
            R$ {order.total.toFixed(2).replace(".", ",")}
          </span>
        </div>

        {/* Cliente */}
        <div className="space-y-2 mb-4">
          <p className="font-bold text-foreground text-lg leading-tight">{order.customer}</p>
          <a 
            href={`tel:${order.phone}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Phone className="h-3 w-3 text-primary" />
            </div>
            {order.phone}
          </a>
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="h-3 w-3 text-primary" />
            </div>
            <span className="line-clamp-2">{order.address}</span>
          </p>
        </div>

        {/* Itens */}
        <div className={`${config.bgLight} rounded-xl p-3 mb-4 border border-border/50`}>
          <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-1.5">
            📦 Itens do Pedido
          </p>
          <ul className="space-y-1.5">
            {order.items.slice(0, 3).map((item, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
            {order.items.length > 3 && (
              <li className="text-xs text-muted-foreground italic">
                +{order.items.length - 3} item(s)
              </li>
            )}
          </ul>
        </div>

        {/* Pagamento */}
        <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-xl">
          <span className="text-sm text-muted-foreground font-medium">Pagamento:</span>
          <Badge variant="outline" className="flex items-center gap-1.5 font-semibold">
            <PaymentIcon className="h-3.5 w-3.5" />
            {order.paymentMethod}
          </Badge>
        </div>

        {/* Ação Principal */}
        {nextStatus && config.nextLabel && (
          <Button
            variant="default"
            size="lg"
            className={`w-full font-bold text-base gap-2 bg-gradient-to-r ${config.gradient} hover:opacity-90 text-white shadow-md`}
            onClick={() => onUpdateStatus(order.id, nextStatus)}
          >
            {config.nextIcon && <config.nextIcon className="h-5 w-5" />}
            {config.nextLabel}
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Button>
        )}

        {order.status === "delivered" && (
          <div className="text-center py-3">
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-green-100 text-green-700 border-green-200">
              ✅ Pedido Finalizado
            </Badge>
          </div>
        )}
      </div>
    </motion.div>
  );
}

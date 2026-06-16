import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Package, CheckCircle, Truck, Phone, MapPin, CreditCard, Banknote, QrCode, ArrowRight, XCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type OrderStatus = "pending" | "preparing" | "ready" | "delivering" | "delivered" | "cancelled";

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
  notes?: string;
  orderNumber?: number;
}

interface OrderCardProps {
  order: Order;
  index: number;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const statusConfig: Record<OrderStatus, {
  label: string;
  emoji: string;
  gradient: string;
  bgLight: string;
  icon: typeof Clock;
  nextLabel: string | null;
  nextIcon: typeof Clock | null;
}> = {
  pending: { 
    label: "Novo Pedido", emoji: "🔴",
    gradient: "from-yellow-500 to-orange-500",
    bgLight: "bg-yellow-50",
    icon: Clock, nextLabel: "Iniciar Preparo", nextIcon: Package,
  },
  preparing: { 
    label: "Preparando", emoji: "🟡",
    gradient: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50",
    icon: Package, nextLabel: "Marcar Pronto", nextIcon: CheckCircle,
  },
  ready: { 
    label: "Pronto", emoji: "🟢",
    gradient: "from-green-500 to-emerald-500",
    bgLight: "bg-green-50",
    icon: CheckCircle, nextLabel: "Saiu p/ Entrega", nextIcon: Truck,
  },
  delivering: { 
    label: "Em Rota", emoji: "🚀",
    gradient: "from-purple-500 to-pink-500",
    bgLight: "bg-purple-50",
    icon: Truck, nextLabel: "Confirmar Entrega", nextIcon: CheckCircle,
  },
  delivered: { 
    label: "Entregue", emoji: "✅",
    gradient: "from-gray-400 to-gray-500",
    bgLight: "bg-gray-50",
    icon: CheckCircle, nextLabel: null, nextIcon: null,
  },
  cancelled: { 
    label: "Cancelado", emoji: "❌",
    gradient: "from-red-400 to-red-600",
    bgLight: "bg-red-50",
    icon: XCircle, nextLabel: null, nextIcon: null,
  },
};

const paymentIcons: Record<string, typeof CreditCard> = {
  "PIX": QrCode,
  "Cartão": CreditCard,
  "Dinheiro": Banknote,
};

export function OrderCard({ order, index, onUpdateStatus }: OrderCardProps) {
  const config = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = config.icon;
  const PaymentIcon = paymentIcons[order.paymentMethod] || CreditCard;

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const flow: OrderStatus[] = ["pending", "preparing", "ready", "delivering", "delivered"];
    const currentIndex = flow.indexOf(currentStatus);
    return currentIndex >= 0 && currentIndex < flow.length - 1 ? flow[currentIndex + 1] : null;
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
  const isCancelled = order.status === "cancelled";
  const isFinished = order.status === "delivered" || isCancelled;

  const whatsappLink = `https://wa.me/55${order.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Olá ${order.customer}! Sobre seu pedido ${order.orderNumber ? `#${order.orderNumber}` : ""} no Roxinho.`
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
      className={`bg-card rounded-2xl border-2 shadow-lg overflow-hidden transition-all hover:shadow-xl ${
        isUrgent ? "border-yellow-400 ring-2 ring-yellow-200 shadow-yellow-100" : 
        isCancelled ? "border-red-300 opacity-70" : "border-border"
      }`}
    >
      {/* Status Header */}
      <div className={`bg-gradient-to-r ${config.gradient} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2 text-white">
          <StatusIcon className="h-4 w-4" />
          <span className="font-bold text-sm">{config.emoji} {config.label}</span>
        </div>
        <Badge variant="secondary" className="bg-white/20 text-white border-0 font-mono text-xs">
          #{order.orderNumber || order.id.slice(0, 6)}
        </Badge>
      </div>

      <div className="p-4">
        {/* Tempo e Valor */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className={`text-xs ${isUrgent ? "border-yellow-400 text-yellow-600 bg-yellow-50" : "border-muted"}`}>
            ⏱️ {formatTime(order.createdAt)}
          </Badge>
          <span className="text-xl font-bold text-primary">
            R$ {order.total.toFixed(2).replace(".", ",")}
          </span>
        </div>

        {/* Cliente */}
        <div className="space-y-1.5 mb-3">
          <p className="font-bold text-foreground text-base leading-tight">{order.customer}</p>
          <div className="flex items-center gap-2">
            <a 
              href={`tel:${order.phone}`}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-3 w-3 text-primary" />
              {order.phone}
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 transition-colors"
            >
              <MessageCircle className="h-3 w-3" />
              WhatsApp
            </a>
          </div>
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 text-primary shrink-0 mt-0.5" />
            <span className="line-clamp-2">{order.address}</span>
          </p>
        </div>

        {/* Itens */}
        <div className={`${config.bgLight} rounded-xl p-3 mb-3 border border-border/50`}>
          <p className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">📦 Itens</p>
          <ul className="space-y-1">
            {order.items.slice(0, 4).map((item, i) => (
              <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                <span className="text-primary font-bold">•</span>
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
            {order.items.length > 4 && (
              <li className="text-xs text-muted-foreground italic">
                +{order.items.length - 4} item(s)
              </li>
            )}
          </ul>
        </div>

        {/* Observações */}
        {order.notes && (
          <div className="mb-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-800">📝 {order.notes}</p>
          </div>
        )}

        {/* Pagamento */}
        <div className="flex items-center justify-between mb-3 p-2 bg-muted/50 rounded-xl">
          <span className="text-xs text-muted-foreground font-medium">Pagamento:</span>
          <Badge variant="outline" className="flex items-center gap-1 text-xs font-semibold">
            <PaymentIcon className="h-3 w-3" />
            {order.paymentMethod}
          </Badge>
        </div>

        {/* Ações */}
        {!isFinished && (
          <div className="space-y-2">
            {/* Avançar Status */}
            {nextStatus && config.nextLabel && (
              <Button
                variant="default"
                size="sm"
                className={`w-full font-bold gap-2 bg-gradient-to-r ${config.gradient} hover:opacity-90 text-white shadow-md`}
                onClick={() => onUpdateStatus(order.id, nextStatus)}
              >
                {config.nextIcon && <config.nextIcon className="h-4 w-4" />}
                {config.nextLabel}
                <ArrowRight className="h-3 w-3 ml-auto" />
              </Button>
            )}

            {/* Cancelar */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full text-xs text-red-500 hover:text-red-700 hover:bg-red-50">
                  <XCircle className="h-3 w-3 mr-1" />
                  Cancelar Pedido
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancelar pedido?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. O pedido de {order.customer} será cancelado.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Voltar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onUpdateStatus(order.id, "cancelled")}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Sim, cancelar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {order.status === "delivered" && (
          <div className="text-center py-2">
            <Badge variant="secondary" className="text-xs px-3 py-1.5 bg-green-100 text-green-700 border-green-200">
              ✅ Pedido Finalizado
            </Badge>
          </div>
        )}

        {isCancelled && (
          <div className="text-center py-2">
            <Badge variant="secondary" className="text-xs px-3 py-1.5 bg-red-100 text-red-700 border-red-200">
              ❌ Pedido Cancelado
            </Badge>
          </div>
        )}
      </div>
    </motion.div>
  );
}

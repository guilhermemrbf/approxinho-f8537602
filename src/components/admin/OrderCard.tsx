import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Package, CheckCircle, Truck, Phone, MapPin, CreditCard, Banknote, QrCode, ArrowRight, XCircle, MessageCircle, Printer, User, Hash, Receipt } from "lucide-react";
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
      className={`bg-card rounded-2xl border-2 shadow-lg overflow-hidden transition-all hover:shadow-xl print:shadow-none print:border ${
        isUrgent ? "border-yellow-400 ring-2 ring-yellow-200 shadow-yellow-100 animate-pulse-subtle" :
        isCancelled ? "border-red-300 opacity-70" : "border-border"
      }`}
    >
      {/* Status Header */}
      <div className={`bg-gradient-to-r ${config.gradient} px-4 py-3 flex items-center justify-between text-white`}>
        <div className="flex items-center gap-2">
          <div className="bg-white/20 rounded-full p-1.5">
            <StatusIcon className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <p className="font-bold text-sm">{config.emoji} {config.label}</p>
            <p className="text-[10px] opacity-90 flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              há {formatTime(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <Badge variant="secondary" className="bg-white/25 text-white border-0 font-mono text-xs gap-1">
            <Hash className="h-3 w-3" />
            {order.orderNumber || order.id.slice(0, 6)}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        {/* Comanda - Cabeçalho cliente */}
        <div className="border-b-2 border-dashed border-border pb-3 mb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="bg-primary/10 rounded-full p-1.5 shrink-0">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="font-bold text-foreground text-base leading-tight truncate">{order.customer}</p>
            </div>
            <Badge variant="outline" className={`text-[10px] shrink-0 ${isUrgent ? "border-yellow-400 text-yellow-700 bg-yellow-50" : "border-muted"}`}>
              ⏱️ {formatTime(order.createdAt)}
            </Badge>
          </div>
          <div className="flex items-center gap-3 flex-wrap pl-8">
            <a
              href={`tel:${order.phone}`}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              <Phone className="h-3 w-3" />
              {order.phone}
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 transition-colors font-semibold"
            >
              <MessageCircle className="h-3 w-3" />
              WhatsApp
            </a>
          </div>
          <p className="flex items-start gap-2 text-xs text-foreground/80 mt-2 pl-8">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <span className="leading-snug">{order.address}</span>
          </p>
        </div>

        {/* Itens da Comanda */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Receipt className="h-3.5 w-3.5 text-primary" />
            <p className="text-[11px] font-bold text-foreground uppercase tracking-wider">
              Itens do Pedido ({order.items.length})
            </p>
          </div>
          <ul className="space-y-1.5 bg-muted/40 rounded-xl p-3 border border-border/50">
            {order.items.map((item, i) => (
              <li key={i} className="text-xs text-foreground flex items-start gap-2 pb-1.5 border-b border-dashed border-border/60 last:border-0 last:pb-0">
                <span className="bg-primary text-primary-foreground text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Observações */}
        {order.notes && (
          <div className="mb-3 p-2.5 bg-amber-50 rounded-lg border-l-4 border-amber-400">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-0.5">📝 Observação</p>
            <p className="text-xs text-amber-900 leading-snug">{order.notes}</p>
          </div>
        )}

        {/* Totais e Pagamento - Rodapé da comanda */}
        <div className="border-t-2 border-dashed border-border pt-3 mb-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <PaymentIcon className="h-3.5 w-3.5 text-primary" />
              {order.paymentMethod}
            </span>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
              <p className="text-2xl font-extrabold text-primary leading-none">
                R$ {order.total.toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>
        </div>

        {/* Ações */}
        {!isFinished && (
          <div className="space-y-2 print:hidden">
            {/* Avançar Status */}
            {nextStatus && config.nextLabel && (
              <Button
                variant="default"
                size="default"
                className={`w-full font-bold gap-2 bg-gradient-to-r ${config.gradient} hover:opacity-90 text-white shadow-md h-11`}
                onClick={() => onUpdateStatus(order.id, nextStatus)}
              >
                {config.nextIcon && <config.nextIcon className="h-4 w-4" />}
                {config.nextLabel}
                <ArrowRight className="h-3 w-3 ml-auto" />
              </Button>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs gap-1"
                onClick={() => window.print()}
              >
                <Printer className="h-3 w-3" />
                Imprimir
              </Button>
              {/* Cancelar */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50">
                    <XCircle className="h-3 w-3 mr-1" />
                    Cancelar
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

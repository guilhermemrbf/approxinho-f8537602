import { motion } from "framer-motion";
import { Clock, Package, Truck, CheckCircle, DollarSign, TrendingUp } from "lucide-react";

interface StatsProps {
  orders: {
    status: string;
    total: number;
  }[];
}

export function DashboardStats({ orders }: StatsProps) {
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const preparingCount = orders.filter((o) => o.status === "preparing").length;
  const readyCount = orders.filter((o) => o.status === "ready").length;
  const deliveringCount = orders.filter((o) => o.status === "delivering").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const todayRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((acc, o) => acc + o.total, 0);

  const stats = [
    {
      label: "Novos Pedidos",
      value: pendingCount,
      icon: Clock,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      bgLight: "bg-yellow-50",
      urgent: pendingCount > 0,
    },
    {
      label: "Preparando",
      value: preparingCount,
      icon: Package,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      label: "Prontos p/ Entrega",
      value: readyCount,
      icon: CheckCircle,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgLight: "bg-green-50",
    },
    {
      label: "Em Rota",
      value: deliveringCount,
      icon: Truck,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgLight: "bg-purple-50",
    },
    {
      label: "Entregues Hoje",
      value: deliveredCount,
      icon: TrendingUp,
      color: "bg-gray-500",
      textColor: "text-gray-600",
      bgLight: "bg-gray-50",
    },
    {
      label: "Faturamento",
      value: `R$ ${totalRevenue.toFixed(2).replace(".", ",")}`,
      icon: DollarSign,
      color: "bg-primary",
      textColor: "text-primary",
      bgLight: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative rounded-xl border p-4 ${stat.bgLight} ${
              stat.urgent ? "ring-2 ring-yellow-400 animate-pulse" : ""
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${stat.color}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            {stat.urgent && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

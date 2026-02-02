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
  const todayDeliveredRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((acc, o) => acc + o.total, 0);

  const stats = [
    {
      label: "Novos Pedidos",
      value: pendingCount,
      icon: Clock,
      gradient: "from-yellow-500 to-orange-500",
      bgLight: "bg-gradient-to-br from-yellow-50 to-orange-50",
      borderColor: "border-yellow-200",
      urgent: pendingCount > 0,
    },
    {
      label: "Preparando",
      value: preparingCount,
      icon: Package,
      gradient: "from-blue-500 to-cyan-500",
      bgLight: "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
    },
    {
      label: "Prontos",
      value: readyCount,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      bgLight: "bg-gradient-to-br from-green-50 to-emerald-50",
      borderColor: "border-green-200",
    },
    {
      label: "Em Rota",
      value: deliveringCount,
      icon: Truck,
      gradient: "from-purple-500 to-pink-500",
      bgLight: "bg-gradient-to-br from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
    },
    {
      label: "Entregues",
      value: deliveredCount,
      icon: TrendingUp,
      gradient: "from-gray-500 to-slate-500",
      bgLight: "bg-gradient-to-br from-gray-50 to-slate-50",
      borderColor: "border-gray-200",
    },
    {
      label: "Faturamento",
      value: `R$ ${totalRevenue.toFixed(2).replace(".", ",")}`,
      icon: DollarSign,
      gradient: "from-primary to-pink-500",
      bgLight: "bg-gradient-to-br from-primary/10 to-pink-50",
      borderColor: "border-primary/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative rounded-2xl border-2 p-4 ${stat.bgLight} ${stat.borderColor} ${
              stat.urgent ? "ring-2 ring-yellow-400 shadow-lg shadow-yellow-200/50" : "shadow-sm"
            } transition-all hover:shadow-md hover:-translate-y-0.5`}
          >
            {/* Icon with gradient */}
            <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md mb-3`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            
            {/* Value */}
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            
            {/* Label */}
            <p className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</p>
            
            {/* Urgent indicator */}
            {stat.urgent && (
              <span className="absolute top-3 right-3 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

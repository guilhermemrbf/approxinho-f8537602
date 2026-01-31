import { Clock, Package, CheckCircle, Truck, CheckCheck, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

type OrderStatus = "pending" | "preparing" | "ready" | "delivering" | "delivered" | "cancelled";

interface StatusFilterProps {
  currentFilter: OrderStatus | "all";
  onFilterChange: (filter: OrderStatus | "all") => void;
  orderCounts: Record<OrderStatus | "all", number>;
}

const filterOptions: { value: OrderStatus | "all"; label: string; icon: typeof Clock; color: string }[] = [
  { value: "all", label: "Todos", icon: LayoutGrid, color: "bg-secondary" },
  { value: "pending", label: "Novos", icon: Clock, color: "bg-yellow-500" },
  { value: "preparing", label: "Preparando", icon: Package, color: "bg-blue-500" },
  { value: "ready", label: "Prontos", icon: CheckCircle, color: "bg-green-500" },
  { value: "delivering", label: "Em Rota", icon: Truck, color: "bg-purple-500" },
  { value: "delivered", label: "Entregues", icon: CheckCheck, color: "bg-gray-500" },
];

export function StatusFilter({ currentFilter, onFilterChange, orderCounts }: StatusFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filterOptions.map((option) => {
        const Icon = option.icon;
        const isActive = currentFilter === option.value;
        const count = orderCounts[option.value];

        return (
          <Button
            key={option.value}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(option.value)}
            className={`shrink-0 gap-2 ${isActive ? "" : "hover:bg-muted"}`}
          >
            <Icon className="h-4 w-4" />
            <span>{option.label}</span>
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold ${
              isActive ? "bg-white/20" : "bg-muted"
            }`}>
              {count}
            </span>
          </Button>
        );
      })}
    </div>
  );
}

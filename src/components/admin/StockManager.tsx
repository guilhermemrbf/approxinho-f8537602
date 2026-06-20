import { useStock } from "@/hooks/useStock";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = ["Acompanhamento", "Premium", "Sabor"] as const;
const categoryLabels: Record<(typeof categories)[number], string> = {
  Acompanhamento: "🍫 Acompanhamentos",
  Premium: "✨ Adicionais Premium",
  Sabor: "🍇 Sabores",
};

export function StockManager() {
  const { items, loading, toggleItem, fetchStock } = useStock();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <p className="text-sm text-muted-foreground">
          Desative um ingrediente para ele sumir do app dos clientes imediatamente.
        </p>
        <Button variant="outline" size="sm" onClick={fetchStock} className="gap-2 shrink-0">
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Atualizar</span>
        </Button>
      </div>

      {categories.map((cat) => {
        const catItems = items.filter((i) => i.category === cat);
        if (catItems.length === 0) return null;
        return (
          <div key={cat} className="space-y-3">
            <h3 className="font-bold text-base text-foreground">{categoryLabels[cat]}</h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {catItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-colors ${
                    item.available ? "bg-card border-border" : "bg-muted/40 border-muted"
                  }`}
                >
                  <div className="min-w-0">
                    <p className={`font-medium truncate ${!item.available && "line-through text-muted-foreground"}`}>
                      {item.name}
                    </p>
                    <Badge variant={item.available ? "default" : "secondary"} className="mt-1 text-[10px]">
                      {item.available ? "Disponível" : "Em falta"}
                    </Badge>
                  </div>
                  <Switch
                    checked={item.available}
                    onCheckedChange={() => toggleItem(item.id, item.available)}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
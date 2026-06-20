import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { complements, toppings, flavors } from "@/data/menu";

export interface StockItem {
  id: string;
  category: "Acompanhamento" | "Premium" | "Sabor";
  name: string;
  available: boolean;
}

const ALL_ITEMS: StockItem[] = [
  ...complements.map((i) => ({ id: i.id, category: "Acompanhamento" as const, name: i.name, available: true })),
  ...toppings.map((i) => ({ id: i.id, category: "Premium" as const, name: i.name, available: true })),
  ...flavors.map((i) => ({ id: i.id, category: "Sabor" as const, name: i.name, available: true })),
];

export function useStock() {
  const [stockMap, setStockMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const fetchStock = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("stock_items").select("id, available");
    if (data) {
      const map: Record<string, boolean> = {};
      data.forEach((row) => {
        map[row.id] = row.available;
      });
      setStockMap(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStock();

    // Realtime: react to admin changes instantly across all clients
    const channel = supabase
      .channel("stock_items-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "stock_items" },
        (payload) => {
          const row = (payload.new ?? payload.old) as { id: string; available: boolean } | undefined;
          if (!row) return;
          setStockMap((prev) => ({ ...prev, [row.id]: payload.eventType === "DELETE" ? true : row.available }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchStock]);

  const toggleItem = async (id: string, currentValue: boolean) => {
    const meta = ALL_ITEMS.find((i) => i.id === id);
    if (!meta) return;
    const newValue = !currentValue;
    setStockMap((prev) => ({ ...prev, [id]: newValue }));
    await supabase
      .from("stock_items")
      .upsert(
        { id, category: meta.category, name: meta.name, available: newValue, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );
  };

  const items: StockItem[] = ALL_ITEMS.map((item) => ({
    ...item,
    available: stockMap[item.id] !== undefined ? stockMap[item.id] : true,
  }));

  return { items, loading, toggleItem, fetchStock };
}
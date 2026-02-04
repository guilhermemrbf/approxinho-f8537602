import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export type OrderStatus = "pending" | "preparing" | "ready" | "delivering" | "delivered" | "cancelled";
export type PaymentMethod = "pix" | "card" | "cash";
export interface OrderItem {
  name: string;
  size: string;
  quantity: number;
  price: number;
  details?: string;
}

export interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  address_complement: string | null;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_change_for: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderData {
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  address_complement?: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
  payment_change_for?: number;
  notes?: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      // Parse items from JSONB
      const parsedOrders = (data || []).map((order) => ({
        ...order,
        items: order.items as unknown as OrderItem[],
        status: order.status as OrderStatus,
        payment_method: order.payment_method as PaymentMethod,
      }));

      setOrders(parsedOrders);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Erro ao carregar pedidos");
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pedidos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createOrder = useCallback(async (orderData: CreateOrderData): Promise<Order | null> => {
    try {
      const { data, error: insertError } = await supabase
        .from("orders")
        .insert([{
          customer_name: orderData.customer_name,
          customer_phone: orderData.customer_phone,
          delivery_address: orderData.delivery_address,
          address_complement: orderData.address_complement || null,
          items: JSON.parse(JSON.stringify(orderData.items)),
          subtotal: orderData.subtotal,
          delivery_fee: orderData.delivery_fee,
          total: orderData.total,
          payment_method: orderData.payment_method,
          payment_change_for: orderData.payment_change_for || null,
          notes: orderData.notes || null,
          user_id: user?.id || null, // Link order to authenticated user
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      const newOrder: Order = {
        ...data,
        items: data.items as unknown as OrderItem[],
        status: data.status as OrderStatus,
        payment_method: data.payment_method as PaymentMethod,
      };

      toast({
        title: "Pedido enviado!",
        description: `Seu pedido #${newOrder.order_number} foi recebido`,
      });

      return newOrder;
    } catch (err) {
      console.error("Error creating order:", err);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o pedido",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: OrderStatus): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (updateError) throw updateError;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      return true;
    } catch (err) {
      console.error("Error updating order status:", err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do pedido",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Subscribe to realtime updates
  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("Realtime update:", payload);

          if (payload.eventType === "INSERT") {
            const newOrder: Order = {
              ...(payload.new as Record<string, unknown>),
              items: (payload.new as Record<string, unknown>).items as unknown as OrderItem[],
              status: (payload.new as Record<string, unknown>).status as OrderStatus,
              payment_method: (payload.new as Record<string, unknown>).payment_method as PaymentMethod,
            } as Order;
            
            setOrders((prev) => [newOrder, ...prev]);
            
            // Play notification sound for new orders (will be handled by component)
            window.dispatchEvent(new CustomEvent("new-order", { detail: newOrder }));
          }

          if (payload.eventType === "UPDATE") {
            const updatedOrder: Order = {
              ...(payload.new as Record<string, unknown>),
              items: (payload.new as Record<string, unknown>).items as unknown as OrderItem[],
              status: (payload.new as Record<string, unknown>).status as OrderStatus,
              payment_method: (payload.new as Record<string, unknown>).payment_method as PaymentMethod,
            } as Order;
            
            setOrders((prev) =>
              prev.map((order) =>
                order.id === updatedOrder.id ? updatedOrder : order
              )
            );
          }

          if (payload.eventType === "DELETE") {
            const deletedId = (payload.old as Record<string, unknown>).id as string;
            setOrders((prev) => prev.filter((order) => order.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrderStatus,
  };
}

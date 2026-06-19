import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Banknote, QrCode, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { businessInfo } from "@/data/menu";
import { useToast } from "@/hooks/use-toast";
import { useOrders, PaymentMethod as DbPaymentMethod } from "@/hooks/useOrders";

type PaymentMethod = "pix" | "credit" | "debit" | "cash";
type DeliveryZone = "cidade" | "povoado";

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  complement: string;
  reference: string;
  changeFor: string;
  notes: string;
}

/**
 * ==============================================
 * INTEGRAÇÃO DE PAGAMENTO - PONTOS DE CONEXÃO
 * ==============================================
 * 
 * Para integrar com Mercado Pago (ou outro gateway):
 * 
 * 1. PIX:
 *    - Substituir handleGeneratePix() para chamar a Edge Function
 *    - A Edge Function cria o pagamento via API do MP e retorna QR code
 *    - Usar o qr_code_base64 retornado para exibir o QR real
 *    - Implementar polling com getPaymentStatus() para confirmar pagamento
 * 
 * 2. CARTÃO (Crédito/Débito):
 *    - Integrar SDK do Mercado Pago para tokenização do cartão
 *    - Ou usar Checkout Pro (redirect) via createPreference()
 *    - handleCardPayment() deve enviar o token para a Edge Function
 * 
 * 3. WEBHOOK:
 *    - Criar Edge Function para receber notificações do MP
 *    - Atualizar status do pedido automaticamente quando pagamento aprovado
 * 
 * Arquivos relacionados:
 *    - src/lib/mercadopago.ts (client-side types e helpers)
 *    - supabase/functions/mercadopago/ (criar Edge Function)
 * ==============================================
 */

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const { createOrder } = useOrders();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>("cidade");
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    address: "",
    complement: "",
    reference: "",
    changeFor: "",
    notes: "",
  });

  const deliveryFee = deliveryZone === "povoado" ? businessInfo.deliveryFee : 0;
  const grandTotal = totalPrice + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-xl font-bold mb-2">Seu carrinho está vazio</h1>
          <p className="text-muted-foreground mb-6">Adicione itens antes de finalizar</p>
          <Link to="/montar">
            <Button variant="hero">Monte seu Açaí</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const validateForm = () => {
    if (!customerInfo.name.trim()) {
      toast({ title: "Nome obrigatório", variant: "destructive" });
      return false;
    }
    if (!customerInfo.phone.trim() || customerInfo.phone.replace(/\D/g, "").length < 10) {
      toast({ title: "Telefone válido obrigatório", variant: "destructive" });
      return false;
    }
    if (!customerInfo.address.trim()) {
      toast({ title: "Endereço obrigatório", variant: "destructive" });
      return false;
    }
    return true;
  };

  const mapPaymentMethod = (method: PaymentMethod): DbPaymentMethod => {
    switch (method) {
      case "pix": return "pix";
      case "credit":
      case "debit": return "card";
      case "cash": return "cash";
      default: return "pix";
    }
  };

  const buildOrderData = () => {
    const orderItems = items.map((item) => ({
      name: item.flavor.name,
      size: item.size.name,
      quantity: item.quantity,
      price: item.totalPrice,
      details: [
        ...item.complements.map(c => c.name),
        ...item.toppings.map(t => t.name),
        ...item.fruits.map(f => f.name),
      ].join(", ") || undefined,
    }));

    const changeValue = customerInfo.changeFor 
      ? parseFloat(customerInfo.changeFor.replace(",", "."))
      : undefined;

    const fullAddress = customerInfo.reference 
      ? `${customerInfo.address} (${customerInfo.reference})`
      : customerInfo.address;

    return {
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      delivery_address: fullAddress,
      address_complement: customerInfo.complement || undefined,
      items: orderItems,
      subtotal: totalPrice,
      delivery_fee: deliveryFee,
      total: grandTotal,
      payment_method: mapPaymentMethod(paymentMethod),
      payment_change_for: changeValue,
      notes: customerInfo.notes || undefined,
    };
  };

  const submitOrder = async () => {
    const order = await createOrder(buildOrderData());
    return order;
  };

  /**
   * PONTO DE INTEGRAÇÃO: CARTÃO
   * 
   * Opção A - Checkout Pro (redirect):
   * ```
   * const mp = new MercadoPagoClient();
   * const preference = await mp.createPreference({
   *   items: items.map(i => ({
   *     id: i.id, title: i.flavor.name, quantity: i.quantity, unit_price: i.totalPrice
   *   })),
   *   back_urls: {
   *     success: `${window.location.origin}/pedidos`,
   *     failure: `${window.location.origin}/checkout`,
   *     pending: `${window.location.origin}/pedidos`
   *   }
   * });
   * window.location.href = preference.init_point;
   * ```
   * 
   * Opção B - Checkout Transparente:
   * Requer SDK do MP no frontend + Edge Function para processar token
   */
  const handleCardPayment = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    // TODO: Integrar com Mercado Pago
    // Por enquanto, cria o pedido com status pendente de pagamento
    const order = await submitOrder();
    
    if (order) {
      clearCart();
      navigate("/pedidos");
    }
    
    setIsProcessing(false);
  };

  const handleCashPayment = async () => {
    if (!validateForm()) return;
    
    if (paymentMethod === "cash" && customerInfo.changeFor) {
      const changeValue = parseFloat(customerInfo.changeFor.replace(",", "."));
      if (changeValue < grandTotal) {
        toast({ 
          title: "Valor insuficiente", 
          description: "O troco deve ser maior que o total",
          variant: "destructive" 
        });
        return;
      }
    }
    
    setIsProcessing(true);
    const order = await submitOrder();
    if (order) {
      clearCart();
      navigate("/pedidos");
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="container py-4 sm:py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <Link to="/carrinho">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Checkout</h1>
            <p className="text-xs text-muted-foreground">{items.length} item(s) no pedido</p>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Formulário */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Dados do Cliente */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border shadow-card p-4 sm:p-6"
            >
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                📍 Dados de Entrega
              </h2>
              
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Telefone / WhatsApp *</Label>
                  <Input
                    id="phone"
                    placeholder="(00) 00000-0000"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange("phone", formatPhone(e.target.value))}
                  />
                </div>
                
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="address">Endereço completo *</Label>
                  <Input
                    id="address"
                    placeholder="Rua, número, bairro"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    placeholder="Apt, bloco, etc."
                    value={customerInfo.complement}
                    onChange={(e) => handleInputChange("complement", e.target.value)}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="reference">Ponto de referência</Label>
                  <Input
                    id="reference"
                    placeholder="Próximo a..."
                    value={customerInfo.reference}
                    onChange={(e) => handleInputChange("reference", e.target.value)}
                  />
                </div>
              </div>
            </motion.div>

            {/* Forma de Pagamento */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border shadow-card p-4 sm:p-6"
            >
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                💳 Forma de Pagamento
              </h2>
              
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => {
                  setPaymentMethod(value as PaymentMethod);
                  setPixGenerated(false);
                }}
                className="grid gap-3"
              >
                {/* PIX */}
                <label
                  htmlFor="pix"
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "pix"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="pix" id="pix" />
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                    <QrCode className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base">PIX</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Aprovação instantânea</p>
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded-full shrink-0">
                    Recomendado
                  </span>
                </label>

                {/* Cartão de Crédito */}
                <label
                  htmlFor="credit"
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "credit"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="credit" id="credit" />
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base">Cartão de Crédito</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Na entrega (maquininha)</p>
                  </div>
                </label>

                {/* Cartão de Débito */}
                <label
                  htmlFor="debit"
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "debit"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="debit" id="debit" />
                  <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base">Cartão de Débito</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Na entrega (maquininha)</p>
                  </div>
                </label>

                {/* Dinheiro */}
                <label
                  htmlFor="cash"
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "cash"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="cash" id="cash" />
                  <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                    <Banknote className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base">Dinheiro</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Pagamento na entrega</p>
                  </div>
                </label>
              </RadioGroup>

              {/* Campo de troco para dinheiro */}
              {paymentMethod === "cash" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 pt-4 border-t"
                >
                  <Label htmlFor="changeFor">Troco para quanto?</Label>
                  <Input
                    id="changeFor"
                    placeholder="Ex: 50,00"
                    className="mt-2"
                    value={customerInfo.changeFor}
                    onChange={(e) => handleInputChange("changeFor", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Deixe em branco se não precisar de troco
                  </p>
                </motion.div>
              )}

              {/* PIX QR Code */}
              {paymentMethod === "pix" && pixGenerated && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-6 pt-6 border-t text-center"
                >
                  {/* QR Code - será substituído pelo QR real */}
                  <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-sm">
                    {pixQrBase64 ? (
                      <img src={`data:image/png;base64,${pixQrBase64}`} alt="QR Code PIX" className="h-48 w-48" />
                    ) : (
                      <div className="h-48 w-48 bg-gradient-to-br from-muted to-muted-foreground/20 rounded-lg flex flex-col items-center justify-center gap-2">
                        <QrCode className="h-20 w-20 text-foreground/30" />
                        <p className="text-xs text-muted-foreground">QR Code Simulado</p>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    Copie o código abaixo e pague no app do seu banco
                  </p>
                  
                  <div className="flex gap-2">
                    <Input
                      value={pixCode}
                      readOnly
                      className="text-xs font-mono"
                    />
                    <Button variant="outline" size="icon" onClick={copyPixCode} className="shrink-0">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Timer indicativo */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>O código PIX expira em 30 minutos</span>
                  </div>
                  
                  <Button
                    variant="hero"
                    className="w-full mt-4"
                    onClick={confirmPixPayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Já paguei - Confirmar Pedido
                  </Button>
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    {paymentId 
                      ? "O pagamento será verificado automaticamente" 
                      : "⚠️ Integração em desenvolvimento - pedido será criado como pendente"
                    }
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Observações */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border shadow-card p-4 sm:p-6"
            >
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                📝 Observações
              </h2>
              <Textarea
                placeholder="Alguma observação sobre o pedido? (alergia, preferências, etc.)"
                className="min-h-[80px]"
                value={customerInfo.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </motion.div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-2xl border shadow-card p-4 sm:p-6 space-y-4">
              <h2 className="font-bold text-lg">Resumo do Pedido</h2>

              {/* Items */}
              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="min-w-0 flex-1">
                      <span className="mr-1">{item.flavor.icon}</span>
                      <span>{item.quantity}x {item.flavor.name}</span>
                      <p className="text-xs text-muted-foreground ml-5 truncate">
                        {item.size.name}
                      </p>
                    </div>
                    <span className="font-medium shrink-0 ml-2">
                      R$ {(item.totalPrice * item.quantity).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de entrega</span>
                  <span>R$ {deliveryFee.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">
                    R$ {grandTotal.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>

              {/* Botão de ação baseado no método de pagamento */}
              {paymentMethod === "pix" && !pixGenerated && (
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleGeneratePix}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Gerando PIX...
                    </>
                  ) : (
                    <>
                      <QrCode className="h-4 w-4 mr-2" />
                      Gerar QR Code PIX
                    </>
                  )}
                </Button>
              )}

              {(paymentMethod === "credit" || paymentMethod === "debit") && (
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleCardPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Confirmar Pedido ({paymentMethod === "credit" ? "Crédito" : "Débito"})
                    </>
                  )}
                </Button>
              )}

              {paymentMethod === "cash" && (
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleCashPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando pedido...
                    </>
                  ) : (
                    <>
                      <Banknote className="h-4 w-4 mr-2" />
                      Confirmar Pedido
                    </>
                  )}
                </Button>
              )}

              {/* Segurança */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Pagamento seguro e criptografado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

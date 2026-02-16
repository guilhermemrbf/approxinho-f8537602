import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Copy, CreditCard, Banknote, QrCode, Loader2 } from "lucide-react";
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

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  complement: string;
  reference: string;
  changeFor: string;
  notes: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const { createOrder } = useOrders();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixGenerated, setPixGenerated] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    address: "",
    complement: "",
    reference: "",
    changeFor: "",
    notes: "",
  });

  const deliveryFee = businessInfo.deliveryFee;
  const grandTotal = totalPrice + deliveryFee;

  // Mock PIX code - será substituído pela integração Mercado Pago
  const mockPixCode = "00020126580014br.gov.bcb.pix0136queroacai-pix-key-placeholder5204000053039865802BR5925QUERO ACAI DELIVERY6008UIBAI62070503***6304ABCD";

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

  const validateForm = () => {
    if (!customerInfo.name.trim()) {
      toast({ title: "Nome obrigatório", variant: "destructive" });
      return false;
    }
    if (!customerInfo.phone.trim()) {
      toast({ title: "Telefone obrigatório", variant: "destructive" });
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

  const submitOrder = async () => {
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

    const order = await createOrder({
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
    });

    return order;
  };

  const handleGeneratePix = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    // TODO: Integrar com Mercado Pago API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setPixGenerated(true);
    setIsProcessing(false);
    
    toast({ title: "PIX gerado com sucesso!", description: "Escaneie o QR Code ou copie o código" });
  };

  const handleCardPayment = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
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

  const copyPixCode = () => {
    navigator.clipboard.writeText(mockPixCode);
    toast({ title: "Código PIX copiado!" });
  };

  const confirmPixPayment = async () => {
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
      <div className="container py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/carrinho">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Formulário */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dados do Cliente */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border shadow-card p-6"
            >
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                📍 Dados de Entrega
              </h2>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone / WhatsApp *</Label>
                  <Input
                    id="phone"
                    placeholder="(00) 00000-0000"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Endereço completo *</Label>
                  <Input
                    id="address"
                    placeholder="Rua, número, bairro"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    placeholder="Apt, bloco, etc."
                    value={customerInfo.complement}
                    onChange={(e) => handleInputChange("complement", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
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
              className="bg-card rounded-2xl border shadow-card p-6"
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
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "pix"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="pix" id="pix" />
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <QrCode className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">PIX</p>
                    <p className="text-sm text-muted-foreground">Aprovação instantânea</p>
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                    Recomendado
                  </span>
                </label>

                {/* Cartão de Crédito */}
                <label
                  htmlFor="credit"
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "credit"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="credit" id="credit" />
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Cartão de Crédito</p>
                    <p className="text-sm text-muted-foreground">Parcele em até 12x</p>
                  </div>
                </label>

                {/* Cartão de Débito */}
                <label
                  htmlFor="debit"
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "debit"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="debit" id="debit" />
                  <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Cartão de Débito</p>
                    <p className="text-sm text-muted-foreground">Débito na hora</p>
                  </div>
                </label>

                {/* Dinheiro */}
                <label
                  htmlFor="cash"
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "cash"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="cash" id="cash" />
                  <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <Banknote className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Dinheiro</p>
                    <p className="text-sm text-muted-foreground">Pagamento na entrega</p>
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
                  <div className="bg-white p-4 rounded-xl inline-block mb-4">
                    {/* Placeholder QR Code - será substituído pelo QR real do Mercado Pago */}
                    <div className="h-48 w-48 bg-gradient-to-br from-muted to-muted-foreground/20 rounded-lg flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-foreground/50" />
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    Escaneie o QR Code ou copie o código abaixo
                  </p>
                  
                  <div className="flex gap-2">
                    <Input
                      value={mockPixCode}
                      readOnly
                      className="text-xs font-mono"
                    />
                    <Button variant="outline" size="icon" onClick={copyPixCode}>
                      <Copy className="h-4 w-4" />
                    </Button>
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
                    Já paguei
                  </Button>
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    O pagamento será verificado automaticamente
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Observações */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border shadow-card p-6"
            >
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                📝 Observações
              </h2>
              <Textarea
                placeholder="Alguma observação sobre o pedido? (alergia, preferências, etc.)"
                className="min-h-[100px]"
                value={customerInfo.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </motion.div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-2xl border shadow-card p-6 space-y-4">
              <h2 className="font-bold text-lg">Resumo do Pedido</h2>

              {/* Items */}
              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <span className="mr-2">{item.flavor.icon}</span>
                      <span>{item.quantity}x {item.flavor.name}</span>
                      <p className="text-xs text-muted-foreground ml-6">
                        {item.size.name}
                      </p>
                    </div>
                    <span className="font-medium">
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
                      Pagar com {paymentMethod === "credit" ? "Crédito" : "Débito"}
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

              <p className="text-xs text-center text-muted-foreground">
                Ao confirmar, você concorda com nossos termos de serviço
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

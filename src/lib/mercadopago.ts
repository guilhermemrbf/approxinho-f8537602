/**
 * Mercado Pago Integration Module
 * 
 * Este módulo prepara a integração com a API do Mercado Pago.
 * Para ativar, você precisará:
 * 
 * 1. Criar uma conta no Mercado Pago Developers: https://www.mercadopago.com.br/developers
 * 2. Obter suas credenciais (Access Token e Public Key)
 * 3. Configurar as credenciais no backend (Edge Function)
 * 
 * Fluxos suportados:
 * - PIX: Pagamento instantâneo via QR Code
 * - Checkout Pro: Redireciona para página do Mercado Pago
 * - Checkout Transparente: Pagamento sem sair do site (requer certificação PCI)
 */

// Tipos para a API do Mercado Pago
export interface MercadoPagoPayment {
  id: string;
  status: 'pending' | 'approved' | 'authorized' | 'in_process' | 'in_mediation' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back';
  status_detail: string;
  transaction_amount: number;
  date_created: string;
  date_approved?: string;
  payer: {
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: {
      number: string;
    };
  };
  point_of_interaction?: {
    transaction_data?: {
      qr_code: string;
      qr_code_base64: string;
      ticket_url: string;
    };
  };
}

export interface CreatePixPaymentParams {
  amount: number;
  description: string;
  payer: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  externalReference?: string;
}

export interface CreatePreferenceParams {
  items: Array<{
    id: string;
    title: string;
    description?: string;
    quantity: number;
    unit_price: number;
    picture_url?: string;
  }>;
  payer?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      street_name: string;
      street_number?: string;
      zip_code?: string;
    };
  };
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return?: 'approved' | 'all';
  payment_methods?: {
    excluded_payment_methods?: Array<{ id: string }>;
    excluded_payment_types?: Array<{ id: string }>;
    installments?: number;
  };
  external_reference?: string;
  notification_url?: string;
}

export interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

/**
 * Classe para integração com Mercado Pago
 * 
 * Uso:
 * ```typescript
 * const mp = new MercadoPagoClient();
 * 
 * // Criar pagamento PIX
 * const pix = await mp.createPixPayment({
 *   amount: 50.00,
 *   description: "Pedido Q!delícia",
 *   payer: { email: "cliente@email.com" }
 * });
 * 
 * // Criar preferência para Checkout Pro
 * const preference = await mp.createPreference({
 *   items: [{ id: "1", title: "Açaí 500ml", quantity: 1, unit_price: 24.00 }]
 * });
 * ```
 */
export class MercadoPagoClient {
  private apiUrl: string;

  constructor() {
    // URL base para chamadas à Edge Function
    // Será configurada quando o Supabase/Cloud estiver habilitado
    this.apiUrl = '/api/mercadopago';
  }

  /**
   * Cria um pagamento PIX
   */
  async createPixPayment(params: CreatePixPaymentParams): Promise<MercadoPagoPayment> {
    const response = await fetch(`${this.apiUrl}/pix`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar pagamento PIX');
    }

    return response.json();
  }

  /**
   * Cria uma preferência para Checkout Pro
   */
  async createPreference(params: CreatePreferenceParams): Promise<MercadoPagoPreference> {
    const response = await fetch(`${this.apiUrl}/preference`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar preferência');
    }

    return response.json();
  }

  /**
   * Consulta o status de um pagamento
   */
  async getPaymentStatus(paymentId: string): Promise<MercadoPagoPayment> {
    const response = await fetch(`${this.apiUrl}/payment/${paymentId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao consultar pagamento');
    }

    return response.json();
  }

  /**
   * Processa notificação de webhook
   */
  async processWebhook(data: unknown): Promise<void> {
    const response = await fetch(`${this.apiUrl}/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao processar webhook');
    }
  }
}

// Instância singleton
export const mercadoPago = new MercadoPagoClient();

/**
 * Hook para usar o Mercado Pago em componentes React
 * 
 * Exemplo de uso futuro:
 * ```typescript
 * const { createPixPayment, isLoading, error } = useMercadoPago();
 * ```
 */
export function useMercadoPago() {
  // TODO: Implementar hooks com React Query quando backend estiver pronto
  return {
    client: mercadoPago,
    // Adicionar estados de loading, error, etc.
  };
}

interface PaymentData {
  amount: number; // em centavos
  currency: string;
  description: string;
  customerEmail?: string;
  customerName?: string;
  metadata?: Record<string, string>;
}

interface PaymentIntent {
  id: string;
  client_secret: string;
  status: string;
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

interface AppointmentPaymentData {
  agendamentoId: string;
  clientName: string;
  clientEmail?: string;
  services: Array<{
    name: string;
    price: number;
  }>;
  barbershop: string;
  barber: string;
  date: string;
  time: string;
}

class StripeService {
  private publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
  private backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  // Criar Payment Intent para agendamento
  async createAppointmentPaymentIntent(appointmentData: AppointmentPaymentData): Promise<PaymentIntent | null> {
    try {
      const totalAmount = appointmentData.services.reduce((total, service) => total + service.price, 0);
      
      const paymentData: PaymentData = {
        amount: Math.round(totalAmount * 100), // Converter para centavos
        currency: 'brl',
        description: `Agendamento - ${appointmentData.services.map(s => s.name).join(', ')}`,
        customerEmail: appointmentData.clientEmail,
        customerName: appointmentData.clientName,
        metadata: {
          agendamento_id: appointmentData.agendamentoId,
          barbershop: appointmentData.barbershop,
          barber: appointmentData.barber,
          date: appointmentData.date,
          time: appointmentData.time,
          services: appointmentData.services.map(s => s.name).join(', ')
        }
      };

      const response = await fetch(`${this.backendUrl}/api/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`Payment API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Payment intent created:', result.id);
      return result;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return null;
    }
  }

  // Confirmar pagamento
  async confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.backendUrl}/api/payments/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_intent_id: paymentIntentId,
          payment_method_id: paymentMethodId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Payment confirmation error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Payment confirmed:', result);
      return result.status === 'succeeded';
    } catch (error) {
      console.error('Error confirming payment:', error);
      return false;
    }
  }

  // Cancelar Payment Intent
  async cancelPaymentIntent(paymentIntentId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.backendUrl}/api/payments/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_intent_id: paymentIntentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Payment cancellation error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Payment cancelled:', result);
      return true;
    } catch (error) {
      console.error('Error cancelling payment:', error);
      return false;
    }
  }

  // Criar reembolso
  async createRefund(paymentIntentId: string, amount?: number, reason?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.backendUrl}/api/payments/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_intent_id: paymentIntentId,
          amount: amount ? Math.round(amount * 100) : undefined, // Converter para centavos se especificado
          reason: reason || 'requested_by_customer',
        }),
      });

      if (!response.ok) {
        throw new Error(`Refund error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Refund created:', result);
      return true;
    } catch (error) {
      console.error('Error creating refund:', error);
      return false;
    }
  }

  // Buscar status do pagamento
  async getPaymentStatus(paymentIntentId: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.backendUrl}/api/payments/status/${paymentIntentId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Payment status error: ${response.status}`);
      }

      const result = await response.json();
      return result.status;
    } catch (error) {
      console.error('Error getting payment status:', error);
      return null;
    }
  }

  // Buscar histórico de pagamentos do cliente
  async getCustomerPayments(customerEmail: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.backendUrl}/api/payments/customer/${encodeURIComponent(customerEmail)}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Customer payments error: ${response.status}`);
      }

      const result = await response.json();
      return result.payments || [];
    } catch (error) {
      console.error('Error getting customer payments:', error);
      return [];
    }
  }

  // Calcular taxa de processamento
  calculateProcessingFee(amount: number): number {
    // Taxa padrão do Stripe no Brasil: 3.4% + R$ 0,60
    const percentageFee = amount * 0.034;
    const fixedFee = 0.60;
    return percentageFee + fixedFee;
  }

  // Formatar valor para exibição
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  }

  // Verificar se o Stripe está configurado
  isConfigured(): boolean {
    return !!(this.publishableKey && this.backendUrl);
  }

  // Obter chave pública para o frontend
  getPublishableKey(): string {
    return this.publishableKey;
  }

  // Método para testar a conexão com o backend
  async testConnection(): Promise<boolean> {
    if (!this.isConfigured()) {
      console.error('Stripe not configured');
      return false;
    }

    try {
      const response = await fetch(`${this.backendUrl}/api/payments/health`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Stripe connection test failed:', error);
      return false;
    }
  }
}

export const stripeService = new StripeService();
export type { AppointmentPaymentData, PaymentData, PaymentIntent };
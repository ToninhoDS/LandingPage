interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template';
  text?: {
    body: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text: string;
      }>;
    }>;
  };
}

interface AppointmentData {
  clientName: string;
  clientPhone: string;
  service: string;
  barber: string;
  barbershop: string;
  date: string;
  time: string;
  address: string;
  price: number;
}

class WhatsAppService {
  private baseURL = 'https://graph.facebook.com/v18.0';
  private phoneNumberId = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '';
  private accessToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN || '';

  private async sendMessage(message: WhatsAppMessage): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('WhatsApp message sent:', result);
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  async sendAppointmentConfirmation(appointment: AppointmentData): Promise<boolean> {
    const message: WhatsAppMessage = {
      to: appointment.clientPhone,
      type: 'text',
      text: {
        body: `🎉 *Agendamento Confirmado!*

Olá ${appointment.clientName}! Seu agendamento foi confirmado com sucesso.

📅 *Detalhes do Agendamento:*
• Serviço: ${appointment.service}
• Profissional: ${appointment.barber}
• Local: ${appointment.barbershop}
• Data: ${appointment.date}
• Horário: ${appointment.time}
• Endereço: ${appointment.address}
• Valor: R$ ${appointment.price.toFixed(2)}

📍 *Localização:* ${appointment.address}

⏰ *Lembrete:* Chegue com 10 minutos de antecedência.

Em caso de dúvidas ou necessidade de reagendamento, entre em contato conosco.

Obrigado por escolher nossa barbearia! ✂️`
      }
    };

    return this.sendMessage(message);
  }

  async sendAppointmentReminder(appointment: AppointmentData): Promise<boolean> {
    const message: WhatsAppMessage = {
      to: appointment.clientPhone,
      type: 'text',
      text: {
        body: `⏰ *Lembrete de Agendamento*

Olá ${appointment.clientName}! Lembramos que você tem um agendamento hoje.

📅 *Detalhes:*
• Serviço: ${appointment.service}
• Profissional: ${appointment.barber}
• Horário: ${appointment.time}
• Local: ${appointment.barbershop}
• Endereço: ${appointment.address}

📍 Chegue com 10 minutos de antecedência.

Nos vemos em breve! ✂️`
      }
    };

    return this.sendMessage(message);
  }

  async sendAppointmentCancellation(appointment: AppointmentData, reason?: string): Promise<boolean> {
    const message: WhatsAppMessage = {
      to: appointment.clientPhone,
      type: 'text',
      text: {
        body: `❌ *Agendamento Cancelado*

Olá ${appointment.clientName}, infelizmente precisamos cancelar seu agendamento.

📅 *Agendamento Cancelado:*
• Serviço: ${appointment.service}
• Data: ${appointment.date}
• Horário: ${appointment.time}
${reason ? `• Motivo: ${reason}` : ''}

💬 Entre em contato conosco para reagendar:
📞 Telefone: (11) 99999-9999
💻 App: Barbearia App

Pedimos desculpas pelo inconveniente.`
      }
    };

    return this.sendMessage(message);
  }

  async sendPromotionalMessage(clientPhone: string, clientName: string, promotion: string): Promise<boolean> {
    const message: WhatsAppMessage = {
      to: clientPhone,
      type: 'text',
      text: {
        body: `🎉 *Promoção Especial!*

Olá ${clientName}!

${promotion}

📱 Agende pelo nosso app e garante já o seu horário!

Válido por tempo limitado. Não perca! ✂️`
      }
    };

    return this.sendMessage(message);
  }

  async sendWelcomeMessage(clientPhone: string, clientName: string): Promise<boolean> {
    const message: WhatsAppMessage = {
      to: clientPhone,
      type: 'text',
      text: {
        body: `👋 Bem-vindo à Barbearia App!

Olá ${clientName}! É um prazer ter você conosco.

🎯 *Com nosso app você pode:*
• Agendar serviços facilmente
• Escolher seu profissional favorito
• Acompanhar histórico de cortes
• Receber lembretes automáticos
• Avaliar nossos serviços

📱 Baixe nosso app e tenha a melhor experiência!

Estamos aqui para cuidar do seu visual! ✂️`
      }
    };

    return this.sendMessage(message);
  }

  // Método para formatar número de telefone brasileiro
  formatPhoneNumber(phone: string): string {
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Adiciona código do país se não estiver presente
    if (cleaned.length === 11 && cleaned.startsWith('11')) {
      return `55${cleaned}`;
    } else if (cleaned.length === 10) {
      return `5511${cleaned}`;
    } else if (cleaned.length === 13 && cleaned.startsWith('55')) {
      return cleaned;
    }
    
    return cleaned;
  }

  // Método para validar se o WhatsApp está configurado
  isConfigured(): boolean {
    return !!(this.phoneNumberId && this.accessToken);
  }

  // Método para testar a conexão
  async testConnection(): Promise<boolean> {
    if (!this.isConfigured()) {
      console.error('WhatsApp not configured');
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/${this.phoneNumberId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('WhatsApp connection test failed:', error);
      return false;
    }
  }
}

export const whatsappService = new WhatsAppService();
export type { AppointmentData };
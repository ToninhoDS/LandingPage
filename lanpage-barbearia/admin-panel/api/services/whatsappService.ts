import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// Types
export interface WhatsAppMessage {
  id: string;
  from_number: string;
  to_number: string;
  message: string;
  type: 'text' | 'image' | 'document' | 'audio' | 'video';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface WhatsAppTemplate {
  name: string;
  language: string;
  components: Array<{
    type: string;
    parameters?: Array<{
      type: string;
      text?: string;
    }>;
  }>;
}

export interface WhatsAppContact {
  phone: string;
  name?: string;
  user_id?: string;
  last_interaction?: string;
  status: 'active' | 'blocked' | 'inactive';
}

// Lazy initialization for Supabase
let supabaseClient: any = null;

function getSupabaseClient() {
  if (!supabaseClient && process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    supabaseClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  }
  return supabaseClient;
}

export class WhatsAppService {
  private static phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  private static accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  private static verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
  private static baseUrl = 'https://graph.facebook.com/v18.0';

  // Check if WhatsApp is configured
  static isConfigured(): boolean {
    return !!(this.phoneNumberId && this.accessToken);
  }

  // Send text message
  static async sendTextMessage(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.isConfigured()) {
        return { success: false, error: 'WhatsApp not configured' };
      }

      const whatsappMessage = {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: {
          body: message,
        },
      };

      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        whatsappMessage,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const messageId = response.data.messages[0].id;

      // Store message in database
      await this.storeMessage({
        id: messageId,
        from_number: this.phoneNumberId!,
        to_number: to,
        message,
        type: 'text',
        timestamp: new Date().toISOString(),
        status: 'sent'
      });

      return { success: true, messageId };
    } catch (error: any) {
      console.error('Error sending WhatsApp message:', error);
      return { success: false, error: error.message };
    }
  }

  // Send template message
  static async sendTemplateMessage(to: string, template: WhatsAppTemplate): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.isConfigured()) {
        return { success: false, error: 'WhatsApp not configured' };
      }

      const whatsappMessage = {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template,
      };

      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        whatsappMessage,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const messageId = response.data.messages[0].id;

      // Store message in database
      await this.storeMessage({
        id: messageId,
        from_number: this.phoneNumberId!,
        to_number: to,
        message: `Template: ${template.name}`,
        type: 'text',
        timestamp: new Date().toISOString(),
        status: 'sent'
      });

      return { success: true, messageId };
    } catch (error: any) {
      console.error('Error sending WhatsApp template:', error);
      return { success: false, error: error.message };
    }
  }

  // Mark message as read
  static async markMessageAsRead(messageId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.isConfigured()) {
        return { success: false, error: 'WhatsApp not configured' };
      }

      await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return { success: true };
    } catch (error: any) {
      console.error('Error marking message as read:', error);
      return { success: false, error: error.message };
    }
  }

  // Process incoming webhook
  static async processWebhook(body: any): Promise<{ success: boolean; error?: string }> {
    try {
      if (!body.object || body.object !== 'whatsapp_business_account') {
        return { success: false, error: 'Invalid webhook object' };
      }

      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === 'messages') {
            await this.processMessageChange(change.value);
          }
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error processing webhook:', error);
      return { success: false, error: error.message };
    }
  }

  // Process message changes from webhook
  private static async processMessageChange(value: any): Promise<void> {
    try {
      // Process incoming messages
      if (value.messages) {
        for (const message of value.messages) {
          await this.processIncomingMessage(message, value.metadata.phone_number_id);
        }
      }

      // Process message status updates
      if (value.statuses) {
        for (const status of value.statuses) {
          await this.updateMessageStatus(status.id, status.status);
        }
      }
    } catch (error) {
      console.error('Error processing message change:', error);
    }
  }

  // Process incoming message
  private static async processIncomingMessage(message: any, phoneNumberId: string): Promise<void> {
    try {
      const from = message.from;
      const messageId = message.id;
      const timestamp = new Date(parseInt(message.timestamp) * 1000).toISOString();

      let messageText = '';
      let messageType = 'text';

      // Extract message content based on type
      if (message.text) {
        messageText = message.text.body;
        messageType = 'text';
      } else if (message.image) {
        messageText = message.image.caption || 'Image received';
        messageType = 'image';
      } else if (message.document) {
        messageText = message.document.caption || 'Document received';
        messageType = 'document';
      } else if (message.audio) {
        messageText = 'Audio message received';
        messageType = 'audio';
      } else if (message.video) {
        messageText = message.video.caption || 'Video received';
        messageType = 'video';
      }

      // Store incoming message
      await this.storeMessage({
        id: messageId,
        from_number: from,
        to_number: phoneNumberId,
        message: messageText,
        type: messageType as any,
        timestamp,
        status: 'delivered'
      });

      // Update contact
      await this.updateContact(from);

      // Process business logic
      await this.processBusinessLogic(from, messageText, phoneNumberId);

      // Mark as read
      await this.markMessageAsRead(messageId);

    } catch (error) {
      console.error('Error processing incoming message:', error);
    }
  }

  // Process business logic for incoming messages
  private static async processBusinessLogic(from: string, message: string, phoneNumberId: string): Promise<void> {
    try {
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes('agendar') || lowerMessage.includes('marcar') || lowerMessage.includes('horário')) {
        // Handle appointment booking request
        await this.sendTextMessage(from, 
          '🗓️ *Agendamento de Horário*\n\n' +
          'Olá! Para agendar seu horário, você pode:\n\n' +
          '📱 Usar nosso app: [link do app]\n' +
          '🌐 Acessar nosso site: [link do site]\n' +
          '📞 Ligar: (11) 99999-9999\n\n' +
          'Nossos horários disponíveis:\n' +
          '• Segunda a Sexta: 8h às 18h\n' +
          '• Sábado: 8h às 16h\n\n' +
          'Em breve um de nossos atendentes entrará em contato!'
        );
      } else if (lowerMessage.includes('cancelar')) {
        // Handle cancellation request
        await this.sendTextMessage(from,
          '❌ *Cancelamento de Agendamento*\n\n' +
          'Para cancelar seu agendamento:\n\n' +
          '📱 Use nosso app\n' +
          '🌐 Acesse nosso site\n' +
          '📞 Ligue: (11) 99999-9999\n\n' +
          'Por favor, cancele com pelo menos 2 horas de antecedência.\n\n' +
          'Obrigado pela compreensão!'
        );
      } else if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('quanto')) {
        // Handle pricing inquiry
        await this.sendTextMessage(from,
          '💰 *Tabela de Preços*\n\n' +
          '✂️ Corte Masculino: R$ 25,00\n' +
          '🧔 Barba: R$ 15,00\n' +
          '✂️🧔 Corte + Barba: R$ 35,00\n' +
          '👶 Infantil: R$ 20,00\n' +
          '👴 Terceira Idade: R$ 20,00\n\n' +
          '💳 Aceitamos: Dinheiro, PIX, Cartão\n\n' +
          'Agende já seu horário!'
        );
      } else if (lowerMessage.includes('localização') || lowerMessage.includes('endereço') || lowerMessage.includes('onde')) {
        // Handle location inquiry
        await this.sendTextMessage(from,
          '📍 *Nossa Localização*\n\n' +
          'Rua das Flores, 123\n' +
          'Centro - São Paulo/SP\n' +
          'CEP: 01234-567\n\n' +
          '🚗 Estacionamento disponível\n' +
          '🚌 Próximo ao metrô\n\n' +
          '[Link do Google Maps]'
        );
      } else if (lowerMessage.includes('funcionamento') || lowerMessage.includes('aberto') || lowerMessage.includes('horário')) {
        // Handle business hours inquiry
        await this.sendTextMessage(from,
          '🕐 *Horário de Funcionamento*\n\n' +
          '📅 Segunda a Sexta: 8h às 18h\n' +
          '📅 Sábado: 8h às 16h\n' +
          '📅 Domingo: Fechado\n\n' +
          '🎉 Feriados: Consulte nossa agenda\n\n' +
          'Agende seu horário!'
        );
      } else {
        // Default response
        await this.sendTextMessage(from,
          '👋 *Olá!*\n\n' +
          'Obrigado pela sua mensagem!\n\n' +
          'Para melhor atendê-lo, você pode:\n\n' +
          '📱 *Agendar*: Digite "agendar"\n' +
          '💰 *Preços*: Digite "preços"\n' +
          '📍 *Localização*: Digite "endereço"\n' +
          '🕐 *Horários*: Digite "funcionamento"\n\n' +
          'Em breve retornaremos o contato!'
        );
      }
    } catch (error) {
      console.error('Error processing business logic:', error);
    }
  }

  // Store message in database
  private static async storeMessage(message: WhatsAppMessage): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      await supabase
        .from('whatsapp_messages')
        .insert([message]);
    } catch (error) {
      console.error('Error storing message:', error);
    }
  }

  // Update message status
  private static async updateMessageStatus(messageId: string, status: string): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      await supabase
        .from('whatsapp_messages')
        .update({ status })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  }

  // Update contact information
  private static async updateContact(phone: string): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { data: existingContact } = await supabase
        .from('whatsapp_contacts')
        .select('*')
        .eq('phone', phone)
        .single();

      if (existingContact) {
        await supabase
          .from('whatsapp_contacts')
          .update({ 
            last_interaction: new Date().toISOString(),
            status: 'active'
          })
          .eq('phone', phone);
      } else {
        await supabase
          .from('whatsapp_contacts')
          .insert([{
            phone,
            last_interaction: new Date().toISOString(),
            status: 'active'
          }]);
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  }

  // Get conversation history
  static async getConversationHistory(phone: string, limit: number = 50): Promise<{ success: boolean; messages?: WhatsAppMessage[]; error?: string }> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        return { success: false, error: 'Database not configured' };
      }

      const { data: messages, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .or(`from_number.eq.${phone},to_number.eq.${phone}`)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, messages: messages || [] };
    } catch (error: any) {
      console.error('Error getting conversation history:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all contacts
  static async getContacts(): Promise<{ success: boolean; contacts?: WhatsAppContact[]; error?: string }> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        return { success: false, error: 'Database not configured' };
      }

      const { data: contacts, error } = await supabase
        .from('whatsapp_contacts')
        .select('*')
        .order('last_interaction', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, contacts: contacts || [] };
    } catch (error: any) {
      console.error('Error getting contacts:', error);
      return { success: false, error: error.message };
    }
  }

  // Send appointment reminder
  static async sendAppointmentReminder(phone: string, appointmentDetails: any): Promise<{ success: boolean; error?: string }> {
    try {
      const message = 
        `🗓️ *Lembrete de Agendamento*\n\n` +
        `Olá! Você tem um agendamento marcado:\n\n` +
        `📅 Data: ${appointmentDetails.date}\n` +
        `🕐 Horário: ${appointmentDetails.time}\n` +
        `✂️ Serviço: ${appointmentDetails.service}\n` +
        `👨‍💼 Profissional: ${appointmentDetails.professional}\n\n` +
        `📍 Local: Rua das Flores, 123 - Centro\n\n` +
        `Para cancelar ou reagendar, entre em contato conosco.\n\n` +
        `Aguardamos você! 😊`;

      return await this.sendTextMessage(phone, message);
    } catch (error: any) {
      console.error('Error sending appointment reminder:', error);
      return { success: false, error: error.message };
    }
  }

  // Send promotional message
  static async sendPromotionalMessage(phone: string, promotion: any): Promise<{ success: boolean; error?: string }> {
    try {
      const message = 
        `🎉 *Promoção Especial!*\n\n` +
        `${promotion.title}\n\n` +
        `${promotion.description}\n\n` +
        `💰 Desconto: ${promotion.discount}\n` +
        `📅 Válido até: ${promotion.validUntil}\n\n` +
        `Agende já e aproveite!\n` +
        `📞 (11) 99999-9999`;

      return await this.sendTextMessage(phone, message);
    } catch (error: any) {
      console.error('Error sending promotional message:', error);
      return { success: false, error: error.message };
    }
  }
}
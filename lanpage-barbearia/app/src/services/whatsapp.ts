import { supabase } from '@/lib/supabase';

// Configurações do WhatsApp Business API
const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 segundo

export interface WhatsAppMessage {
  to: string;
  type: 'template' | 'text' | 'interactive';
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
  text?: {
    body: string;
  };
  interactive?: {
    type: 'button' | 'list';
    header?: {
      type: 'text';
      text: string;
    };
    body: {
      text: string;
    };
    footer?: {
      text: string;
    };
    action: {
      buttons?: Array<{
        type: 'reply';
        reply: {
          id: string;
          title: string;
        };
      }>;
      sections?: Array<{
        title: string;
        rows: Array<{
          id: string;
          title: string;
          description?: string;
        }>;
      }>;
    };
  };
}

export interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  webhookVerifyToken?: string;
}

export interface WhatsAppWebhookEvent {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          text?: {
            body: string;
          };
          type: string;
          interactive?: {
            type: string;
            button_reply?: {
              id: string;
              title: string;
            };
            list_reply?: {
              id: string;
              title: string;
            };
          };
        }>;
        statuses?: Array<{
          id: string;
          status: 'sent' | 'delivered' | 'read' | 'failed';
          timestamp: string;
          recipient_id: string;
          errors?: Array<{
            code: number;
            title: string;
            message: string;
          }>;
        }>;
      };
      field: string;
    }>;
  }>;
}

class WhatsAppService {
  private config: WhatsAppConfig | null = null;

  async initialize(barbeariaId: string): Promise<void> {
    try {
      const { data: integracao } = await supabase
        .from('integracoes')
        .select('configuracao')
        .eq('barbearia_id', barbeariaId)
        .eq('tipo', 'whatsapp')
        .eq('ativo', true)
        .single();

      if (integracao) {
        this.config = integracao.configuracao as WhatsAppConfig;
      }
    } catch (error) {
      console.error('Erro ao inicializar WhatsApp:', error);
      throw new Error('Falha ao configurar WhatsApp Business API');
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sendMessage(message: WhatsAppMessage, barbeariaId: string, retryCount = 0): Promise<boolean> {
    if (!this.config) {
      await this.initialize(barbeariaId);
    }

    if (!this.config) {
      throw new Error('WhatsApp não configurado para esta barbearia');
    }

    try {
      const response = await fetch(
        `${WHATSAPP_API_URL}/${this.config.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            ...message,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // Verificar se é um erro temporário que pode ser reprocessado
        const isRetryableError = this.isRetryableError(response.status, result);
        
        if (isRetryableError && retryCount < MAX_RETRY_ATTEMPTS) {
          await this.delay(RETRY_DELAY * Math.pow(2, retryCount)); // Exponential backoff
          return this.sendMessage(message, barbeariaId, retryCount + 1);
        }

        throw new Error(`WhatsApp API Error: ${result.error?.message || 'Unknown error'}`);
      }

      // Log da integração
      await this.logIntegracao(barbeariaId, 'envio_mensagem', message, result, true);

      // Salvar mensagem enviada no banco
      await this.saveMessage(barbeariaId, message, result.messages?.[0]?.id, 'sent');

      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
      await this.logIntegracao(barbeariaId, 'envio_mensagem', message, null, false, error.message);
      
      // Se ainda há tentativas disponíveis e é um erro temporário
      if (retryCount < MAX_RETRY_ATTEMPTS && this.isNetworkError(error)) {
        await this.delay(RETRY_DELAY * Math.pow(2, retryCount));
        return this.sendMessage(message, barbeariaId, retryCount + 1);
      }
      
      return false;
    }
  }

  private isRetryableError(status: number, result: any): boolean {
    // Códigos de status que podem ser reprocessados
    const retryableStatuses = [429, 500, 502, 503, 504];
    return retryableStatuses.includes(status) || 
           (result.error?.code && [1, 2, 4, 10].includes(result.error.code));
  }

  private isNetworkError(error: any): boolean {
    return error.name === 'TypeError' || 
           error.message.includes('fetch') ||
           error.message.includes('network');
  }

  async sendTemplateMessage(
    to: string,
    templateName: string,
    parameters: string[],
    barbeariaId: string
  ): Promise<boolean> {
    const message: WhatsAppMessage = {
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'pt_BR' },
        components: parameters.length > 0 ? [{
          type: 'body',
          parameters: parameters.map(param => ({
            type: 'text',
            text: param,
          })),
        }] : undefined,
      },
    };

    return this.sendMessage(message, barbeariaId);
  }

  async sendTextMessage(to: string, text: string, barbeariaId: string): Promise<boolean> {
    const message: WhatsAppMessage = {
      to,
      type: 'text',
      text: { body: text },
    };

    return this.sendMessage(message, barbeariaId);
  }

  async sendInteractiveMessage(
    to: string,
    body: string,
    buttons: Array<{ id: string; title: string }>,
    barbeariaId: string,
    header?: string,
    footer?: string
  ): Promise<boolean> {
    const message: WhatsAppMessage = {
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        header: header ? { type: 'text', text: header } : undefined,
        body: { text: body },
        footer: footer ? { text: footer } : undefined,
        action: {
          buttons: buttons.map(btn => ({
            type: 'reply',
            reply: {
              id: btn.id,
              title: btn.title,
            },
          })),
        },
      },
    };

    return this.sendMessage(message, barbeariaId);
  }

  async sendAppointmentConfirmation(
    clienteWhatsApp: string,
    nomeCliente: string,
    nomeBarbeiro: string,
    dataHora: string,
    servicos: string,
    barbeariaId: string
  ): Promise<boolean> {
    return this.sendTemplateMessage(
      clienteWhatsApp,
      'confirmacao_agendamento',
      [nomeCliente, nomeBarbeiro, dataHora, servicos],
      barbeariaId
    );
  }

  async sendAppointmentReminder(
    clienteWhatsApp: string,
    nomeCliente: string,
    nomeBarbeiro: string,
    dataHora: string,
    barbeariaId: string
  ): Promise<boolean> {
    return this.sendTemplateMessage(
      clienteWhatsApp,
      'lembrete_agendamento',
      [nomeCliente, nomeBarbeiro, dataHora],
      barbeariaId
    );
  }

  async sendPromotionalMessage(
    clienteWhatsApp: string,
    nomeCliente: string,
    promocao: string,
    barbeariaId: string
  ): Promise<boolean> {
    return this.sendTemplateMessage(
      clienteWhatsApp,
      'promocao',
      [nomeCliente, promocao],
      barbeariaId
    );
  }

  // Webhook handling
  async handleWebhook(webhookData: WhatsAppWebhookEvent): Promise<void> {
    try {
      for (const entry of webhookData.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            await this.processMessages(change.value);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
    }
  }

  private async processMessages(value: any): Promise<void> {
    const { messages, statuses, contacts } = value;

    // Processar mensagens recebidas
    if (messages) {
      for (const message of messages) {
        await this.processIncomingMessage(message, contacts);
      }
    }

    // Processar status de mensagens enviadas
    if (statuses) {
      for (const status of statuses) {
        await this.processMessageStatus(status);
      }
    }
  }

  private async processIncomingMessage(message: any, contacts: any[]): Promise<void> {
    try {
      // Encontrar informações do contato
      const contact = contacts?.find(c => c.wa_id === message.from);
      
      // Salvar mensagem recebida
      await this.saveIncomingMessage(message, contact);

      // Processar resposta automática se necessário
      await this.processAutoResponse(message);
    } catch (error) {
      console.error('Erro ao processar mensagem recebida:', error);
    }
  }

  private async processMessageStatus(status: any): Promise<void> {
    try {
      // Atualizar status da mensagem no banco
      await supabase
        .from('whatsapp_mensagens')
        .update({
          status: status.status,
          updated_at: new Date().toISOString(),
        })
        .eq('whatsapp_message_id', status.id);

      // Se houve erro, salvar detalhes
      if (status.status === 'failed' && status.errors) {
        await this.logIntegracao(
          '', // barbeariaId será obtido da mensagem
          'status_mensagem',
          { messageId: status.id },
          status.errors,
          false,
          status.errors[0]?.message
        );
      }
    } catch (error) {
      console.error('Erro ao processar status da mensagem:', error);
    }
  }

  private async saveIncomingMessage(message: any, contact: any): Promise<void> {
    try {
      // Encontrar barbearia baseada no número de telefone
      const { data: integracao } = await supabase
        .from('integracoes')
        .select('barbearia_id')
        .eq('tipo', 'whatsapp')
        .eq('ativo', true)
        .single();

      if (!integracao) return;

      await supabase.from('whatsapp_mensagens').insert({
        barbearia_id: integracao.barbearia_id,
        whatsapp_message_id: message.id,
        from_number: message.from,
        contact_name: contact?.profile?.name,
        message_type: message.type,
        message_content: message.text?.body || JSON.stringify(message),
        direction: 'received',
        status: 'received',
        timestamp: new Date(parseInt(message.timestamp) * 1000).toISOString(),
      });
    } catch (error) {
      console.error('Erro ao salvar mensagem recebida:', error);
    }
  }

  private async processAutoResponse(message: any): Promise<void> {
    // Implementar lógica de resposta automática baseada no conteúdo da mensagem
    const messageText = message.text?.body?.toLowerCase();
    
    if (!messageText) return;

    // Exemplo de respostas automáticas
    if (messageText.includes('horário') || messageText.includes('horario')) {
      // Responder com horários de funcionamento
      await this.sendAutoResponse(
        message.from,
        'Nossos horários de funcionamento são:\n\n📅 Segunda a Sexta: 9h às 18h\n📅 Sábado: 8h às 17h\n📅 Domingo: Fechado\n\nPara agendar, acesse nosso app!'
      );
    } else if (messageText.includes('preço') || messageText.includes('preco') || messageText.includes('valor')) {
      // Responder com informações de preços
      await this.sendAutoResponse(
        message.from,
        'Confira nossos preços:\n\n✂️ Corte simples: R$ 25\n✂️ Corte + Barba: R$ 35\n✂️ Corte + Barba + Sobrancelha: R$ 45\n\nAgende pelo nosso app para garantir seu horário!'
      );
    } else if (messageText.includes('agendar') || messageText.includes('agendamento')) {
      // Responder com link para agendamento
      await this.sendAutoResponse(
        message.from,
        'Para agendar seu horário, acesse nosso app:\n\n📱 [Link do App]\n\nOu entre em contato conosco durante o horário comercial!'
      );
    }
  }

  private async sendAutoResponse(to: string, text: string): Promise<void> {
    try {
      // Encontrar barbearia para enviar resposta automática
      const { data: integracao } = await supabase
        .from('integracoes')
        .select('barbearia_id')
        .eq('tipo', 'whatsapp')
        .eq('ativo', true)
        .single();

      if (integracao) {
        await this.sendTextMessage(to, text, integracao.barbearia_id);
      }
    } catch (error) {
      console.error('Erro ao enviar resposta automática:', error);
    }
  }

  private async saveMessage(
    barbeariaId: string,
    message: WhatsAppMessage,
    whatsappMessageId?: string,
    status: string = 'sent'
  ): Promise<void> {
    try {
      await supabase.from('whatsapp_mensagens').insert({
        barbearia_id: barbeariaId,
        whatsapp_message_id: whatsappMessageId,
        to_number: message.to,
        message_type: message.type,
        message_content: message.text?.body || JSON.stringify(message),
        direction: 'sent',
        status,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
    }
  }

  private async logIntegracao(
    barbeariaId: string,
    acao: string,
    dadosEntrada: any,
    dadosSaida: any,
    sucesso: boolean,
    erroMensagem?: string
  ): Promise<void> {
    try {
      await supabase.from('logs_integracao').insert({
        barbearia_id: barbeariaId,
        tipo_integracao: 'whatsapp',
        acao,
        dados_entrada: dadosEntrada,
        dados_saida: dadosSaida,
        status: sucesso ? 'sucesso' : 'erro',
        erro_mensagem: erroMensagem,
      });
    } catch (error) {
      console.error('Erro ao salvar log de integração:', error);
    }
  }

  async getTemplates(barbeariaId: string) {
    try {
      const { data, error } = await supabase
        .from('whatsapp_templates')
        .select('*')
        .eq('barbearia_id', barbeariaId)
        .eq('ativo', true);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar templates:', error);
      return [];
    }
  }

  async createTemplate(barbeariaId: string, template: {
    nome: string;
    template_id: string;
    categoria: string;
    conteudo: any;
  }) {
    try {
      const { data, error } = await supabase
        .from('whatsapp_templates')
        .insert({
          barbearia_id: barbeariaId,
          ...template,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar template:', error);
      throw error;
    }
  }

  async getMessageHistory(barbeariaId: string, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('whatsapp_mensagens')
        .select('*')
        .eq('barbearia_id', barbeariaId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar histórico de mensagens:', error);
      return [];
    }
  }

  async getMessageStats(barbeariaId: string, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('whatsapp_mensagens')
        .select('status, direction, created_at')
        .eq('barbearia_id', barbeariaId)
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      const stats = {
        total: data.length,
        sent: data.filter(m => m.direction === 'sent').length,
        received: data.filter(m => m.direction === 'received').length,
        delivered: data.filter(m => m.status === 'delivered').length,
        read: data.filter(m => m.status === 'read').length,
        failed: data.filter(m => m.status === 'failed').length,
      };

      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return null;
    }
  }

  // Webhook verification
  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    const verifyToken = this.config?.webhookVerifyToken || process.env.WHATSAPP_VERIFY_TOKEN;
    
    if (mode === 'subscribe' && token === verifyToken) {
      return challenge;
    }
    
    return null;
  }
}

export const whatsappService = new WhatsAppService();
import { supabase } from '@/lib/supabase';

export interface N8NWorkflow {
  id: string;
  name: string;
  active: boolean;
  nodes: N8NNode[];
  connections: Record<string, any>;
  settings: Record<string, any>;
}

export interface N8NNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, any>;
}

export interface N8NExecution {
  id: string;
  workflowId: string;
  mode: string;
  startedAt: string;
  stoppedAt?: string;
  status: 'running' | 'success' | 'error' | 'waiting';
  data?: Record<string, any>;
}

export interface N8NConfig {
  baseUrl: string;
  apiKey: string;
  webhookUrl?: string;
}

export interface WorkflowTriggerData {
  type: 'appointment' | 'customer' | 'payment' | 'feedback' | 'marketing' | 'inventory';
  action: string;
  data: Record<string, any>;
  barbeariaId: string;
  timestamp: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: {
    type: string;
    conditions: Record<string, any>;
  };
  actions: Array<{
    type: string;
    parameters: Record<string, any>;
  }>;
  active: boolean;
  barbeariaId: string;
}

class N8NService {
  private config: N8NConfig | null = null;

  async initialize(barbeariaId?: string): Promise<void> {
    try {
      const { data } = await supabase
        .from('integracoes')
        .select('configuracao')
        .eq('tipo', 'n8n')
        .eq('ativo', true)
        .single();

      if (data) {
        this.config = data.configuracao as N8NConfig;
      }
    } catch (error) {
      console.error('Erro ao inicializar N8N:', error);
      throw new Error('Falha ao configurar N8N');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.config) {
      throw new Error('N8N não configurado');
    }

    const url = `${this.config.baseUrl}/api/v1${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': this.config.apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`N8N API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Workflows
  async getWorkflows(): Promise<N8NWorkflow[]> {
    return this.makeRequest('/workflows');
  }

  async getWorkflow(id: string): Promise<N8NWorkflow> {
    return this.makeRequest(`/workflows/${id}`);
  }

  async createWorkflow(workflow: Partial<N8NWorkflow>): Promise<N8NWorkflow> {
    return this.makeRequest('/workflows', {
      method: 'POST',
      body: JSON.stringify(workflow),
    });
  }

  async updateWorkflow(id: string, workflow: Partial<N8NWorkflow>): Promise<N8NWorkflow> {
    return this.makeRequest(`/workflows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workflow),
    });
  }

  async activateWorkflow(id: string): Promise<void> {
    await this.makeRequest(`/workflows/${id}/activate`, {
      method: 'POST',
    });
  }

  async deactivateWorkflow(id: string): Promise<void> {
    await this.makeRequest(`/workflows/${id}/deactivate`, {
      method: 'POST',
    });
  }

  // Executions
  async getExecutions(workflowId?: string): Promise<N8NExecution[]> {
    const endpoint = workflowId 
      ? `/executions?workflowId=${workflowId}` 
      : '/executions';
    return this.makeRequest(endpoint);
  }

  async getExecution(id: string): Promise<N8NExecution> {
    return this.makeRequest(`/executions/${id}`);
  }

  async executeWorkflow(workflowId: string, data?: Record<string, any>): Promise<N8NExecution> {
    return this.makeRequest(`/workflows/${workflowId}/execute`, {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  }

  // Webhook triggers
  async triggerWebhook(webhookPath: string, data: Record<string, any>): Promise<any> {
    if (!this.config?.webhookUrl) {
      throw new Error('Webhook URL não configurada');
    }

    const response = await fetch(`${this.config.webhookUrl}/${webhookPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Webhook Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Enhanced business process automation
  async triggerBusinessProcess(triggerData: WorkflowTriggerData): Promise<void> {
    try {
      const webhookPath = this.getWebhookPathForTrigger(triggerData.type, triggerData.action);
      
      await this.triggerWebhook(webhookPath, {
        ...triggerData,
        metadata: {
          source: 'barbershop-system',
          version: '1.0',
          environment: process.env.NODE_ENV || 'development',
        },
      });

      await this.logIntegration('n8n', `${triggerData.type}_${triggerData.action}`, 'success', {
        triggerType: triggerData.type,
        action: triggerData.action,
        barbeariaId: triggerData.barbeariaId,
      });
    } catch (error) {
      await this.logIntegration('n8n', `${triggerData.type}_${triggerData.action}`, 'error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        triggerType: triggerData.type,
        action: triggerData.action,
        barbeariaId: triggerData.barbeariaId,
      });
      throw error;
    }
  }

  private getWebhookPathForTrigger(type: string, action: string): string {
    const pathMap: Record<string, Record<string, string>> = {
      appointment: {
        created: 'appointment/new',
        updated: 'appointment/updated',
        cancelled: 'appointment/cancelled',
        completed: 'appointment/completed',
        reminder: 'appointment/reminder',
        no_show: 'appointment/no-show',
      },
      customer: {
        registered: 'customer/new',
        updated: 'customer/updated',
        birthday: 'customer/birthday',
        loyalty_milestone: 'customer/loyalty',
        inactive: 'customer/inactive',
        feedback_request: 'customer/feedback-request',
      },
      payment: {
        completed: 'payment/completed',
        failed: 'payment/failed',
        refunded: 'payment/refunded',
        overdue: 'payment/overdue',
      },
      feedback: {
        received: 'feedback/received',
        negative: 'feedback/negative',
        positive: 'feedback/positive',
      },
      marketing: {
        campaign_start: 'marketing/campaign-start',
        promotion: 'marketing/promotion',
        newsletter: 'marketing/newsletter',
      },
      inventory: {
        low_stock: 'inventory/low-stock',
        out_of_stock: 'inventory/out-of-stock',
        restock: 'inventory/restock',
      },
    };

    return pathMap[type]?.[action] || `${type}/${action}`;
  }

  // Specific business automation triggers
  async triggerNewAppointmentWorkflow(appointmentData: any): Promise<void> {
    await this.triggerBusinessProcess({
      type: 'appointment',
      action: 'created',
      data: appointmentData,
      barbeariaId: appointmentData.barbearia_id,
      timestamp: new Date().toISOString(),
    });
  }

  async triggerAppointmentReminderWorkflow(appointmentData: any): Promise<void> {
    await this.triggerBusinessProcess({
      type: 'appointment',
      action: 'reminder',
      data: appointmentData,
      barbeariaId: appointmentData.barbearia_id,
      timestamp: new Date().toISOString(),
    });
  }

  async triggerCustomerFeedbackWorkflow(feedbackData: any): Promise<void> {
    await this.triggerBusinessProcess({
      type: 'feedback',
      action: 'received',
      data: feedbackData,
      barbeariaId: feedbackData.barbearia_id,
      timestamp: new Date().toISOString(),
    });
  }

  async triggerMarketingCampaignWorkflow(campaignData: any): Promise<void> {
    await this.triggerBusinessProcess({
      type: 'marketing',
      action: 'campaign_start',
      data: campaignData,
      barbeariaId: campaignData.barbearia_id,
      timestamp: new Date().toISOString(),
    });
  }

  async triggerCustomerLifecycleWorkflow(customerData: any, action: string): Promise<void> {
    await this.triggerBusinessProcess({
      type: 'customer',
      action,
      data: customerData,
      barbeariaId: customerData.barbearia_id,
      timestamp: new Date().toISOString(),
    });
  }

  async triggerPaymentWorkflow(paymentData: any, action: string): Promise<void> {
    await this.triggerBusinessProcess({
      type: 'payment',
      action,
      data: paymentData,
      barbeariaId: paymentData.barbearia_id,
      timestamp: new Date().toISOString(),
    });
  }

  async triggerInventoryWorkflow(inventoryData: any, action: string): Promise<void> {
    await this.triggerBusinessProcess({
      type: 'inventory',
      action,
      data: inventoryData,
      barbeariaId: inventoryData.barbearia_id,
      timestamp: new Date().toISOString(),
    });
  }

  // Automation rules management
  async createAutomationRule(rule: Omit<AutomationRule, 'id'>): Promise<AutomationRule> {
    const { data, error } = await supabase
      .from('automation_rules')
      .insert(rule)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getAutomationRules(barbeariaId: string): Promise<AutomationRule[]> {
    const { data, error } = await supabase
      .from('automation_rules')
      .select('*')
      .eq('barbearia_id', barbeariaId);

    if (error) throw error;
    return data || [];
  }

  async updateAutomationRule(id: string, updates: Partial<AutomationRule>): Promise<AutomationRule> {
    const { data, error } = await supabase
      .from('automation_rules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteAutomationRule(id: string): Promise<void> {
    const { error } = await supabase
      .from('automation_rules')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Workflow templates for comprehensive business automation
  getNewAppointmentWorkflowTemplate(): Partial<N8NWorkflow> {
    return {
      name: 'Novo Agendamento - Automação Completa',
      active: true,
      nodes: [
        {
          id: 'webhook',
          name: 'Webhook Trigger',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [250, 300],
          parameters: {
            path: 'appointment/new',
            httpMethod: 'POST',
          },
        },
        {
          id: 'validate_data',
          name: 'Validar Dados',
          type: 'n8n-nodes-base.function',
          typeVersion: 1,
          position: [450, 300],
          parameters: {
            functionCode: `
              const appointment = items[0].json.data;
              
              // Validar dados obrigatórios
              if (!appointment.cliente_id || !appointment.servico_id || !appointment.data_hora) {
                throw new Error('Dados obrigatórios ausentes');
              }
              
              // Enriquecer dados
              appointment.formatted_date = new Date(appointment.data_hora).toLocaleDateString('pt-BR');
              appointment.formatted_time = new Date(appointment.data_hora).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              });
              
              return [{ json: { appointment } }];
            `,
          },
        },
        {
          id: 'whatsapp_confirmation',
          name: 'WhatsApp - Confirmação',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 1,
          position: [650, 200],
          parameters: {
            url: '={{$env.WHATSAPP_API_URL}}/messages',
            method: 'POST',
            headers: {
              'Authorization': 'Bearer {{$env.WHATSAPP_ACCESS_TOKEN}}',
              'Content-Type': 'application/json',
            },
            body: {
              messaging_product: 'whatsapp',
              to: '={{$json.appointment.cliente.telefone}}',
              type: 'template',
              template: {
                name: 'appointment_confirmation',
                language: { code: 'pt_BR' },
                components: [
                  {
                    type: 'body',
                    parameters: [
                      { type: 'text', text: '={{$json.appointment.cliente.nome}}' },
                      { type: 'text', text: '={{$json.appointment.formatted_date}}' },
                      { type: 'text', text: '={{$json.appointment.formatted_time}}' },
                      { type: 'text', text: '={{$json.appointment.servico.nome}}' },
                    ],
                  },
                ],
              },
            },
          },
        },
        {
          id: 'calendar_event',
          name: 'Google Calendar',
          type: 'n8n-nodes-base.googleCalendar',
          typeVersion: 1,
          position: [650, 300],
          parameters: {
            operation: 'create',
            calendarId: '={{$env.GOOGLE_CALENDAR_ID}}',
            summary: '{{$json.appointment.servico.nome}} - {{$json.appointment.cliente.nome}}',
            description: `
Cliente: {{$json.appointment.cliente.nome}}
Telefone: {{$json.appointment.cliente.telefone}}
Serviço: {{$json.appointment.servico.nome}}
Valor: R$ {{$json.appointment.valor_total}}
            `.trim(),
            start: {
              dateTime: '={{$json.appointment.data_hora}}',
              timeZone: 'America/Sao_Paulo',
            },
            end: {
              dateTime: '={{DateTime.fromISO($json.appointment.data_hora).plus({minutes: $json.appointment.servico.duracao}).toISO()}}',
              timeZone: 'America/Sao_Paulo',
            },
          },
        },
        {
          id: 'schedule_reminder',
          name: 'Agendar Lembrete',
          type: 'n8n-nodes-base.schedule',
          typeVersion: 1,
          position: [650, 400],
          parameters: {
            rule: {
              interval: [{
                field: 'cronExpression',
                value: '0 10 * * *', // Diariamente às 10h
              }],
            },
          },
        },
        {
          id: 'email_notification',
          name: 'Email para Barbeiro',
          type: 'n8n-nodes-base.emailSend',
          typeVersion: 1,
          position: [650, 500],
          parameters: {
            fromEmail: '={{$env.SMTP_FROM_EMAIL}}',
            toEmail: '={{$json.appointment.barbeiro.email}}',
            subject: 'Novo Agendamento - {{$json.appointment.cliente.nome}}',
            text: `
Novo agendamento confirmado:

Cliente: {{$json.appointment.cliente.nome}}
Telefone: {{$json.appointment.cliente.telefone}}
Data: {{$json.appointment.formatted_date}}
Horário: {{$json.appointment.formatted_time}}
Serviço: {{$json.appointment.servico.nome}}
Valor: R$ {{$json.appointment.valor_total}}

Acesse o sistema para mais detalhes.
            `.trim(),
          },
        },
        {
          id: 'update_analytics',
          name: 'Atualizar Analytics',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 1,
          position: [850, 300],
          parameters: {
            url: '={{$env.API_BASE_URL}}/analytics/appointment-created',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer {{$env.API_TOKEN}}',
            },
            body: {
              appointmentId: '={{$json.appointment.id}}',
              barbeariaId: '={{$json.appointment.barbearia_id}}',
              serviceId: '={{$json.appointment.servico_id}}',
              timestamp: '={{$json.timestamp}}',
            },
          },
        },
      ],
      connections: {
        webhook: {
          main: [[{ node: 'validate_data', type: 'main', index: 0 }]],
        },
        validate_data: {
          main: [
            [
              { node: 'whatsapp_confirmation', type: 'main', index: 0 },
              { node: 'calendar_event', type: 'main', index: 0 },
              { node: 'schedule_reminder', type: 'main', index: 0 },
              { node: 'email_notification', type: 'main', index: 0 },
            ],
          ],
        },
        whatsapp_confirmation: {
          main: [[{ node: 'update_analytics', type: 'main', index: 0 }]],
        },
      },
      settings: {
        timezone: 'America/Sao_Paulo',
        saveExecutionProgress: true,
        saveManualExecutions: true,
      },
    };
  }

  getCustomerLifecycleWorkflowTemplate(): Partial<N8NWorkflow> {
    return {
      name: 'Ciclo de Vida do Cliente',
      active: true,
      nodes: [
        {
          id: 'webhook',
          name: 'Customer Lifecycle Trigger',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [250, 300],
          parameters: {
            path: 'customer/lifecycle',
            httpMethod: 'POST',
          },
        },
        {
          id: 'switch_action',
          name: 'Switch por Ação',
          type: 'n8n-nodes-base.switch',
          typeVersion: 1,
          position: [450, 300],
          parameters: {
            values: [
              { conditions: { string: [{ value1: '={{$json.action}}', value2: 'registered' }] } },
              { conditions: { string: [{ value1: '={{$json.action}}', value2: 'birthday' }] } },
              { conditions: { string: [{ value1: '={{$json.action}}', value2: 'loyalty_milestone' }] } },
              { conditions: { string: [{ value1: '={{$json.action}}', value2: 'inactive' }] } },
            ],
          },
        },
        {
          id: 'welcome_message',
          name: 'Mensagem de Boas-vindas',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 1,
          position: [650, 100],
          parameters: {
            url: '={{$env.WHATSAPP_API_URL}}/messages',
            method: 'POST',
            headers: {
              'Authorization': 'Bearer {{$env.WHATSAPP_ACCESS_TOKEN}}',
              'Content-Type': 'application/json',
            },
            body: {
              messaging_product: 'whatsapp',
              to: '={{$json.data.telefone}}',
              type: 'template',
              template: {
                name: 'welcome_customer',
                language: { code: 'pt_BR' },
                components: [
                  {
                    type: 'body',
                    parameters: [
                      { type: 'text', text: '={{$json.data.nome}}' },
                    ],
                  },
                ],
              },
            },
          },
        },
        {
          id: 'birthday_promotion',
          name: 'Promoção de Aniversário',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 1,
          position: [650, 200],
          parameters: {
            url: '={{$env.WHATSAPP_API_URL}}/messages',
            method: 'POST',
            headers: {
              'Authorization': 'Bearer {{$env.WHATSAPP_ACCESS_TOKEN}}',
              'Content-Type': 'application/json',
            },
            body: {
              messaging_product: 'whatsapp',
              to: '={{$json.data.telefone}}',
              type: 'template',
              template: {
                name: 'birthday_promotion',
                language: { code: 'pt_BR' },
                components: [
                  {
                    type: 'body',
                    parameters: [
                      { type: 'text', text: '={{$json.data.nome}}' },
                      { type: 'text', text: '20%' }, // Desconto de aniversário
                    ],
                  },
                ],
              },
            },
          },
        },
        {
          id: 'loyalty_reward',
          name: 'Recompensa de Fidelidade',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 1,
          position: [650, 300],
          parameters: {
            url: '={{$env.API_BASE_URL}}/loyalty/reward',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer {{$env.API_TOKEN}}',
            },
            body: {
              customerId: '={{$json.data.id}}',
              rewardType: 'milestone',
              points: 100,
            },
          },
        },
        {
          id: 'reactivation_campaign',
          name: 'Campanha de Reativação',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 1,
          position: [650, 400],
          parameters: {
            url: '={{$env.WHATSAPP_API_URL}}/messages',
            method: 'POST',
            headers: {
              'Authorization': 'Bearer {{$env.WHATSAPP_ACCESS_TOKEN}}',
              'Content-Type': 'application/json',
            },
            body: {
              messaging_product: 'whatsapp',
              to: '={{$json.data.telefone}}',
              type: 'template',
              template: {
                name: 'reactivation_offer',
                language: { code: 'pt_BR' },
                components: [
                  {
                    type: 'body',
                    parameters: [
                      { type: 'text', text: '={{$json.data.nome}}' },
                      { type: 'text', text: '15%' }, // Desconto de reativação
                    ],
                  },
                ],
              },
            },
          },
        },
      ],
      connections: {
        webhook: {
          main: [[{ node: 'switch_action', type: 'main', index: 0 }]],
        },
        switch_action: {
          main: [
            [{ node: 'welcome_message', type: 'main', index: 0 }],
            [{ node: 'birthday_promotion', type: 'main', index: 0 }],
            [{ node: 'loyalty_reward', type: 'main', index: 0 }],
            [{ node: 'reactivation_campaign', type: 'main', index: 0 }],
          ],
        },
      },
      settings: {
        timezone: 'America/Sao_Paulo',
        saveExecutionProgress: true,
      },
    };
  }

  getInventoryManagementWorkflowTemplate(): Partial<N8NWorkflow> {
    return {
      name: 'Gestão de Estoque Automatizada',
      active: true,
      nodes: [
        {
          id: 'webhook',
          name: 'Inventory Trigger',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [250, 300],
          parameters: {
            path: 'inventory/alert',
            httpMethod: 'POST',
          },
        },
        {
          id: 'check_stock_level',
          name: 'Verificar Nível de Estoque',
          type: 'n8n-nodes-base.function',
          typeVersion: 1,
          position: [450, 300],
          parameters: {
            functionCode: `
              const inventory = items[0].json.data;
              const stockLevel = inventory.quantidade_atual;
              const minLevel = inventory.estoque_minimo;
              const criticalLevel = minLevel * 0.5;
              
              let alertType = 'normal';
              if (stockLevel <= 0) {
                alertType = 'out_of_stock';
              } else if (stockLevel <= criticalLevel) {
                alertType = 'critical';
              } else if (stockLevel <= minLevel) {
                alertType = 'low';
              }
              
              return [{
                json: {
                  ...inventory,
                  alertType,
                  stockLevel,
                  minLevel,
                  criticalLevel
                }
              }];
            `,
          },
        },
        {
          id: 'switch_alert_type',
          name: 'Switch por Tipo de Alerta',
          type: 'n8n-nodes-base.switch',
          typeVersion: 1,
          position: [650, 300],
          parameters: {
            values: [
              { conditions: { string: [{ value1: '={{$json.alertType}}', value2: 'out_of_stock' }] } },
              { conditions: { string: [{ value1: '={{$json.alertType}}', value2: 'critical' }] } },
              { conditions: { string: [{ value1: '={{$json.alertType}}', value2: 'low' }] } },
            ],
          },
        },
        {
          id: 'urgent_notification',
          name: 'Notificação Urgente',
          type: 'n8n-nodes-base.emailSend',
          typeVersion: 1,
          position: [850, 100],
          parameters: {
            fromEmail: '={{$env.SMTP_FROM_EMAIL}}',
            toEmail: '={{$env.MANAGER_EMAIL}}',
            subject: '🚨 ESTOQUE ESGOTADO - {{$json.produto.nome}}',
            text: `
ATENÇÃO: Produto sem estoque!

Produto: {{$json.produto.nome}}
Categoria: {{$json.produto.categoria}}
Estoque atual: {{$json.stockLevel}}
Última venda: {{$json.ultima_movimentacao}}

Ação necessária: Reposição imediata
            `.trim(),
          },
        },
        {
          id: 'critical_notification',
          name: 'Notificação Crítica',
          type: 'n8n-nodes-base.emailSend',
          typeVersion: 1,
          position: [850, 200],
          parameters: {
            fromEmail: '={{$env.SMTP_FROM_EMAIL}}',
            toEmail: '={{$env.MANAGER_EMAIL}}',
            subject: '⚠️ ESTOQUE CRÍTICO - {{$json.produto.nome}}',
            text: `
Estoque em nível crítico!

Produto: {{$json.produto.nome}}
Estoque atual: {{$json.stockLevel}}
Estoque mínimo: {{$json.minLevel}}
Nível crítico: {{$json.criticalLevel}}

Recomendação: Fazer pedido urgente
            `.trim(),
          },
        },
        {
          id: 'low_stock_notification',
          name: 'Notificação Estoque Baixo',
          type: 'n8n-nodes-base.emailSend',
          typeVersion: 1,
          position: [850, 300],
          parameters: {
            fromEmail: '={{$env.SMTP_FROM_EMAIL}}',
            toEmail: '={{$env.MANAGER_EMAIL}}',
            subject: '📦 Estoque Baixo - {{$json.produto.nome}}',
            text: `
Estoque abaixo do mínimo:

Produto: {{$json.produto.nome}}
Estoque atual: {{$json.stockLevel}}
Estoque mínimo: {{$json.minLevel}}

Sugestão: Programar reposição
            `.trim(),
          },
        },
        {
          id: 'auto_order',
          name: 'Pedido Automático',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 1,
          position: [1050, 200],
          parameters: {
            url: '={{$env.SUPPLIER_API_URL}}/orders',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer {{$env.SUPPLIER_API_TOKEN}}',
            },
            body: {
              productId: '={{$json.produto.codigo_fornecedor}}',
              quantity: '={{$json.quantidade_reposicao}}',
              urgency: 'high',
              notes: 'Pedido automático - estoque crítico',
            },
          },
        },
      ],
      connections: {
        webhook: {
          main: [[{ node: 'check_stock_level', type: 'main', index: 0 }]],
        },
        check_stock_level: {
          main: [[{ node: 'switch_alert_type', type: 'main', index: 0 }]],
        },
        switch_alert_type: {
          main: [
            [{ node: 'urgent_notification', type: 'main', index: 0 }],
            [
              { node: 'critical_notification', type: 'main', index: 0 },
              { node: 'auto_order', type: 'main', index: 0 },
            ],
            [{ node: 'low_stock_notification', type: 'main', index: 0 }],
          ],
        },
      },
      settings: {
        timezone: 'America/Sao_Paulo',
        saveExecutionProgress: true,
      },
    };
  }

  // Utility methods
  async createAllDefaultWorkflows(): Promise<void> {
    const workflows = [
      this.getNewAppointmentWorkflowTemplate(),
      this.getCustomerLifecycleWorkflowTemplate(),
      this.getInventoryManagementWorkflowTemplate(),
    ];

    for (const workflow of workflows) {
      try {
        await this.createWorkflow(workflow);
      } catch (error) {
        console.error(`Erro ao criar workflow ${workflow.name}:`, error);
      }
    }
  }

  private async logIntegration(
    tipo: string,
    acao: string,
    status: 'success' | 'error',
    dados: Record<string, any>
  ): Promise<void> {
    try {
      await supabase.from('logs_integracao').insert({
        tipo_integracao: tipo,
        acao,
        status,
        dados_entrada: dados,
        dados_saida: null,
        erro_mensagem: status === 'error' ? dados.error : null,
      });
    } catch (error) {
      console.error('Erro ao salvar log de integração:', error);
    }
  }
}

export const n8nService = new N8NService();
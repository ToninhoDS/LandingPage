import { supabase } from '@/lib/supabase';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface AIConversation {
  id: string;
  userId: string;
  messages: AIMessage[];
  context: Record<string, any>;
  status: 'active' | 'resolved' | 'escalated';
  createdAt: string;
  updatedAt: string;
}

export interface AIConfig {
  provider: 'openai' | 'anthropic';
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
}

export class AIService {
  private config: AIConfig | null = null;

  async initialize(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('integracoes')
        .select('configuracao')
        .eq('tipo', 'ai')
        .eq('ativo', true)
        .single();

      if (error) throw error;
      
      this.config = data.configuracao as AIConfig;
    } catch (error) {
      console.error('Erro ao inicializar AI:', error);
      throw error;
    }
  }

  private async makeAIRequest(messages: AIMessage[]): Promise<string> {
    if (!this.config) {
      throw new Error('AI não configurada');
    }

    const { provider, apiKey, model, maxTokens, temperature } = this.config;

    if (provider === 'openai') {
      return this.makeOpenAIRequest(messages, { apiKey, model, maxTokens, temperature });
    } else if (provider === 'anthropic') {
      return this.makeAnthropicRequest(messages, { apiKey, model, maxTokens, temperature });
    }

    throw new Error('Provedor de AI não suportado');
  }

  private async makeOpenAIRequest(
    messages: AIMessage[],
    config: { apiKey: string; model: string; maxTokens: number; temperature: number }
  ): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        max_tokens: config.maxTokens,
        temperature: config.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async makeAnthropicRequest(
    messages: AIMessage[],
    config: { apiKey: string; model: string; maxTokens: number; temperature: number }
  ): Promise<string> {
    const systemMessage = messages.find(msg => msg.role === 'system');
    const conversationMessages = messages.filter(msg => msg.role !== 'system');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': config.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        system: systemMessage?.content || '',
        messages: conversationMessages.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  async processMessage(
    userId: string,
    message: string,
    conversationId?: string
  ): Promise<{ response: string; conversationId: string }> {
    try {
      // Get or create conversation
      let conversation: AIConversation;
      
      if (conversationId) {
        const { data, error } = await supabase
          .from('conversas_ai')
          .select('*')
          .eq('id', conversationId)
          .single();

        if (error) throw error;
        conversation = data;
      } else {
        // Create new conversation
        const { data, error } = await supabase
          .from('conversas_ai')
          .insert({
            user_id: userId,
            messages: [],
            context: await this.getUserContext(userId),
            status: 'active',
          })
          .select()
          .single();

        if (error) throw error;
        conversation = data;
      }

      // Add user message
      const userMessage: AIMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };

      const messages: AIMessage[] = [
        {
          role: 'system',
          content: this.getSystemPrompt(conversation.context),
        },
        ...conversation.messages,
        userMessage,
      ];

      // Get AI response
      const aiResponse = await this.makeAIRequest(messages);

      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      // Update conversation
      const updatedMessages = [...conversation.messages, userMessage, assistantMessage];
      
      await supabase
        .from('conversas_ai')
        .update({
          messages: updatedMessages,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversation.id);

      await this.logIntegration('ai', 'process_message', 'success', {
        conversationId: conversation.id,
        userId,
        messageLength: message.length,
        responseLength: aiResponse.length,
      });

      return {
        response: aiResponse,
        conversationId: conversation.id,
      };
    } catch (error) {
      await this.logIntegration('ai', 'process_message', 'error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        messageLength: message.length,
      });
      throw error;
    }
  }

  private async getUserContext(userId: string): Promise<Record<string, any>> {
    try {
      // Get user profile
      const { data: user } = await supabase
        .from('usuarios')
        .select('nome, email, telefone, tipo')
        .eq('id', userId)
        .single();

      // Get recent appointments
      const { data: appointments } = await supabase
        .from('agendamentos')
        .select(`
          id,
          data_hora,
          status,
          servicos:agendamento_servicos(
            servico:servicos(nome, preco, duracao)
          ),
          barbeiro:barbeiros(nome)
        `)
        .eq('cliente_id', userId)
        .order('data_hora', { ascending: false })
        .limit(5);

      // Get barber shop info
      const { data: barbearia } = await supabase
        .from('barbearias')
        .select('nome, endereco, telefone, horario_funcionamento')
        .single();

      return {
        user,
        recentAppointments: appointments || [],
        barbearia,
        currentTime: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Erro ao obter contexto do usuário:', error);
      return {};
    }
  }

  private getSystemPrompt(context: Record<string, any>): string {
    const basePrompt = this.config?.systemPrompt || `
Você é um assistente virtual especializado em atendimento para barbearias.
Você deve ser prestativo, profissional e amigável.

Suas principais funções:
1. Responder dúvidas sobre serviços e preços
2. Ajudar com agendamentos
3. Fornecer informações sobre horários de funcionamento
4. Resolver problemas simples
5. Escalar para atendimento humano quando necessário

Diretrizes:
- Seja sempre educado e profissional
- Use linguagem clara e objetiva
- Se não souber algo, seja honesto e ofereça alternativas
- Para questões complexas, sugira contato direto com a barbearia
- Mantenha o foco no contexto da barbearia
`;

    let contextPrompt = basePrompt;

    if (context.user) {
      contextPrompt += `\n\nInformações do cliente:
- Nome: ${context.user.nome}
- Tipo: ${context.user.tipo}`;
    }

    if (context.barbearia) {
      contextPrompt += `\n\nInformações da barbearia:
- Nome: ${context.barbearia.nome}
- Endereço: ${context.barbearia.endereco}
- Telefone: ${context.barbearia.telefone}
- Horário: ${context.barbearia.horario_funcionamento}`;
    }

    if (context.recentAppointments?.length > 0) {
      contextPrompt += `\n\nÚltimos agendamentos do cliente:`;
      context.recentAppointments.forEach((apt: any, index: number) => {
        contextPrompt += `\n${index + 1}. ${apt.data_hora} - ${apt.servicos?.[0]?.servico?.nome} - Status: ${apt.status}`;
      });
    }

    return contextPrompt;
  }

  async getConversationHistory(conversationId: string): Promise<AIConversation | null> {
    try {
      const { data, error } = await supabase
        .from('conversas_ai')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao obter histórico da conversa:', error);
      return null;
    }
  }

  async getUserConversations(userId: string): Promise<AIConversation[]> {
    try {
      const { data, error } = await supabase
        .from('conversas_ai')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao obter conversas do usuário:', error);
      return [];
    }
  }

  async escalateToHuman(conversationId: string, reason: string): Promise<void> {
    try {
      await supabase
        .from('conversas_ai')
        .update({
          status: 'escalated',
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversationId);

      // Create notification for admin
      await supabase.from('notificacoes').insert({
        usuario_id: null, // Admin notification
        tipo: 'escalation',
        titulo: 'Conversa escalada para atendimento humano',
        mensagem: `Conversa ${conversationId} foi escalada. Motivo: ${reason}`,
        dados: { conversationId, reason },
      });

      await this.logIntegration('ai', 'escalate_conversation', 'success', {
        conversationId,
        reason,
      });
    } catch (error) {
      await this.logIntegration('ai', 'escalate_conversation', 'error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        conversationId,
        reason,
      });
      throw error;
    }
  }

  async analyzeCustomerSentiment(message: string): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
    keywords: string[];
  }> {
    try {
      const analysisPrompt = `
Analise o sentimento da seguinte mensagem de cliente de barbearia e retorne um JSON com:
- sentiment: "positive", "neutral" ou "negative"
- confidence: número entre 0 e 1
- keywords: array com palavras-chave relevantes

Mensagem: "${message}"

Responda apenas com o JSON, sem explicações adicionais.
`;

      const response = await this.makeAIRequest([
        { role: 'user', content: analysisPrompt }
      ]);

      const analysis = JSON.parse(response);
      
      await this.logIntegration('ai', 'sentiment_analysis', 'success', {
        message: message.substring(0, 100),
        sentiment: analysis.sentiment,
        confidence: analysis.confidence,
      });

      return analysis;
    } catch (error) {
      await this.logIntegration('ai', 'sentiment_analysis', 'error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        message: message.substring(0, 100),
      });
      
      // Return neutral sentiment as fallback
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        keywords: [],
      };
    }
  }

  async generateAppointmentSuggestions(
    userId: string,
    preferences: Record<string, any>
  ): Promise<string[]> {
    try {
      const context = await this.getUserContext(userId);
      
      const suggestionPrompt = `
Com base no histórico e preferências do cliente, sugira 3 horários para agendamento.
Considere:
- Histórico de agendamentos anteriores
- Preferências informadas: ${JSON.stringify(preferences)}
- Horário atual: ${new Date().toISOString()}

Contexto do cliente: ${JSON.stringify(context)}

Retorne apenas uma lista de sugestões em formato de texto, uma por linha.
`;

      const response = await this.makeAIRequest([
        { role: 'user', content: suggestionPrompt }
      ]);

      const suggestions = response.split('\n').filter(line => line.trim());
      
      await this.logIntegration('ai', 'appointment_suggestions', 'success', {
        userId,
        suggestionsCount: suggestions.length,
      });

      return suggestions;
    } catch (error) {
      await this.logIntegration('ai', 'appointment_suggestions', 'error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      return [];
    }
  }

  async optimizeSchedule(barbeariaId: string, date: string): Promise<{
    optimizedSlots: Array<{
      time: string;
      barberId: string;
      serviceId: string;
      confidence: number;
      reason: string;
    }>;
    recommendations: string[];
    efficiency: number;
  }> {
    try {
      // Get current appointments for the date
      const { data: appointments } = await supabase
        .from('agendamentos')
        .select(`
          *,
          barbeiro:barbeiros(id, nome),
          servicos:agendamento_servicos(
            servico:servicos(id, nome, duracao, preco)
          )
        `)
        .eq('barbearia_id', barbeariaId)
        .gte('data_hora', `${date}T00:00:00`)
        .lt('data_hora', `${date}T23:59:59`);

      // Get barber availability
      const { data: barbers } = await supabase
        .from('barbeiros')
        .select('*')
        .eq('barbearia_id', barbeariaId)
        .eq('ativo', true);

      // Get service statistics
      const { data: serviceStats } = await supabase
        .from('agendamentos')
        .select(`
          servicos:agendamento_servicos(
            servico:servicos(id, nome, duracao)
          ),
          data_hora
        `)
        .eq('barbearia_id', barbeariaId)
        .gte('data_hora', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const optimizationPrompt = `
Analise a agenda da barbearia e otimize os horários disponíveis.

Data: ${date}
Agendamentos atuais: ${JSON.stringify(appointments)}
Barbeiros disponíveis: ${JSON.stringify(barbers)}
Estatísticas de serviços (últimos 30 dias): ${JSON.stringify(serviceStats)}

Retorne um JSON com:
{
  "optimizedSlots": [
    {
      "time": "HH:MM",
      "barberId": "id",
      "serviceId": "id",
      "confidence": 0.95,
      "reason": "Horário de pico com alta demanda"
    }
  ],
  "recommendations": [
    "Sugestão 1",
    "Sugestão 2"
  ],
  "efficiency": 0.85
}

Considere:
- Horários de pico
- Tempo de deslocamento entre serviços
- Preferências históricas dos clientes
- Otimização de receita
- Balanceamento de carga entre barbeiros
`;

      const response = await this.makeAIRequest([
        { role: 'user', content: optimizationPrompt }
      ]);

      const optimization = JSON.parse(response);
      
      await this.logIntegration('ai', 'schedule_optimization', 'success', {
        barbeariaId,
        date,
        efficiency: optimization.efficiency,
      });

      return optimization;
    } catch (error) {
      await this.logIntegration('ai', 'schedule_optimization', 'error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        barbeariaId,
        date,
      });
      
      return {
        optimizedSlots: [],
        recommendations: ['Erro ao otimizar agenda. Tente novamente.'],
        efficiency: 0,
      };
    }
  }

  async generatePersonalizedRecommendations(userId: string): Promise<{
    services: Array<{
      id: string;
      name: string;
      reason: string;
      confidence: number;
    }>;
    products: Array<{
      id: string;
      name: string;
      reason: string;
      confidence: number;
    }>;
    nextAppointment: {
      suggestedDate: string;
      reason: string;
    };
  }> {
    try {
      const context = await this.getUserContext(userId);
      
      // Get available services and products
      const { data: services } = await supabase
        .from('servicos')
        .select('*')
        .eq('ativo', true);

      const { data: products } = await supabase
        .from('produtos')
        .select('*')
        .eq('ativo', true);

      const recommendationPrompt = `
Gere recomendações personalizadas para o cliente baseado em seu histórico e perfil.

Contexto do cliente: ${JSON.stringify(context)}
Serviços disponíveis: ${JSON.stringify(services)}
Produtos disponíveis: ${JSON.stringify(products)}

Retorne um JSON com:
{
  "services": [
    {
      "id": "service_id",
      "name": "Nome do Serviço",
      "reason": "Motivo da recomendação",
      "confidence": 0.85
    }
  ],
  "products": [
    {
      "id": "product_id", 
      "name": "Nome do Produto",
      "reason": "Motivo da recomendação",
      "confidence": 0.75
    }
  ],
  "nextAppointment": {
    "suggestedDate": "2024-01-15T14:00:00",
    "reason": "Baseado no padrão de agendamentos anteriores"
  }
}

Considere:
- Histórico de serviços utilizados
- Frequência de visitas
- Sazonalidade
- Preferências demonstradas
- Tendências de mercado
`;

      const response = await this.makeAIRequest([
        { role: 'user', content: recommendationPrompt }
      ]);

      const recommendations = JSON.parse(response);
      
      await this.logIntegration('ai', 'personalized_recommendations', 'success', {
        userId,
        servicesCount: recommendations.services?.length || 0,
        productsCount: recommendations.products?.length || 0,
      });

      return recommendations;
    } catch (error) {
      await this.logIntegration('ai', 'personalized_recommendations', 'error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      
      return {
        services: [],
        products: [],
        nextAppointment: {
          suggestedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          reason: 'Sugestão padrão para próxima semana',
        },
      };
    }
  }

  async analyzeBusinessInsights(barbeariaId: string, period: 'week' | 'month' | 'quarter'): Promise<{
    insights: string[];
    trends: Array<{
      metric: string;
      trend: 'up' | 'down' | 'stable';
      change: number;
      description: string;
    }>;
    recommendations: string[];
    forecast: {
      revenue: number;
      appointments: number;
      confidence: number;
    };
  }> {
    try {
      const periodDays = period === 'week' ? 7 : period === 'month' ? 30 : 90;
      const startDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

      // Get business data
      const { data: appointments } = await supabase
        .from('agendamentos')
        .select(`
          *,
          servicos:agendamento_servicos(
            servico:servicos(nome, preco, duracao)
          ),
          cliente:usuarios(nome, tipo)
        `)
        .eq('barbearia_id', barbeariaId)
        .gte('created_at', startDate.toISOString());

      const { data: revenue } = await supabase
        .from('pagamentos')
        .select('*')
        .eq('barbearia_id', barbeariaId)
        .gte('created_at', startDate.toISOString());

      const { data: feedback } = await supabase
        .from('avaliacoes')
        .select('*')
        .eq('barbearia_id', barbeariaId)
        .gte('created_at', startDate.toISOString());

      const analysisPrompt = `
Analise os dados de negócio da barbearia e gere insights estratégicos.

Período: ${period} (${periodDays} dias)
Agendamentos: ${JSON.stringify(appointments)}
Receita: ${JSON.stringify(revenue)}
Avaliações: ${JSON.stringify(feedback)}

Retorne um JSON com:
{
  "insights": [
    "Insight 1 sobre o negócio",
    "Insight 2 sobre tendências"
  ],
  "trends": [
    {
      "metric": "Receita",
      "trend": "up",
      "change": 15.5,
      "description": "Crescimento de 15.5% em relação ao período anterior"
    }
  ],
  "recommendations": [
    "Recomendação estratégica 1",
    "Recomendação operacional 2"
  ],
  "forecast": {
    "revenue": 15000,
    "appointments": 120,
    "confidence": 0.85
  }
}

Analise:
- Padrões de agendamento
- Performance financeira
- Satisfação do cliente
- Eficiência operacional
- Oportunidades de crescimento
`;

      const response = await this.makeAIRequest([
        { role: 'user', content: analysisPrompt }
      ]);

      const analysis = JSON.parse(response);
      
      await this.logIntegration('ai', 'business_insights', 'success', {
        barbeariaId,
        period,
        insightsCount: analysis.insights?.length || 0,
      });

      return analysis;
    } catch (error) {
      await this.logIntegration('ai', 'business_insights', 'error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        barbeariaId,
        period,
      });
      
      return {
        insights: ['Erro ao analisar dados. Tente novamente.'],
        trends: [],
        recommendations: [],
        forecast: {
          revenue: 0,
          appointments: 0,
          confidence: 0,
        },
      };
    }
  }

  async generateMarketingContent(barbeariaId: string, type: 'social' | 'email' | 'sms', context: Record<string, any>): Promise<{
    content: string;
    subject?: string;
    hashtags?: string[];
    callToAction: string;
  }> {
    try {
      const { data: barbearia } = await supabase
        .from('barbearias')
        .select('*')
        .eq('id', barbeariaId)
        .single();

      const contentPrompt = `
Gere conteúdo de marketing personalizado para a barbearia.

Barbearia: ${JSON.stringify(barbearia)}
Tipo de conteúdo: ${type}
Contexto: ${JSON.stringify(context)}

Retorne um JSON com:
{
  "content": "Conteúdo principal da mensagem",
  "subject": "Assunto (para email)",
  "hashtags": ["#hashtag1", "#hashtag2"],
  "callToAction": "Chamada para ação"
}

Diretrizes:
- Tom profissional mas amigável
- Foque nos benefícios para o cliente
- Inclua elementos de urgência quando apropriado
- Personalize com base no contexto fornecido
- Mantenha a identidade da marca
`;

      const response = await this.makeAIRequest([
        { role: 'user', content: contentPrompt }
      ]);

      const content = JSON.parse(response);
      
      await this.logIntegration('ai', 'marketing_content', 'success', {
        barbeariaId,
        type,
        contentLength: content.content?.length || 0,
      });

      return content;
    } catch (error) {
      await this.logIntegration('ai', 'marketing_content', 'error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        barbeariaId,
        type,
      });
      
      return {
        content: 'Erro ao gerar conteúdo. Tente novamente.',
        callToAction: 'Entre em contato conosco!',
      };
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
        tipo,
        acao,
        status,
        dados,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Erro ao registrar log de integração:', error);
    }
  }
}

export const aiService = new AIService();
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  MessageCircle, 
  RefreshCw, 
  Send, 
  Settings, 
  Brain,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

import { supabase } from '@/lib/supabase';
import { aiService, AIConversation } from '@/services/ai';

interface AIConfigProps {
  className?: string;
}

export default function AIConfig({ className }: AIConfigProps) {
  const [config, setConfig] = useState({
    provider: 'openai' as 'openai' | 'anthropic',
    apiKey: '',
    model: 'gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7,
    systemPrompt: '',
  });
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [stats, setStats] = useState({
    totalConversations: 0,
    activeConversations: 0,
    escalatedConversations: 0,
    avgResponseTime: 0,
  });
  const [testMessage, setTestMessage] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [scheduleOptimization, setScheduleOptimization] = useState<any>(null);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<any>(null);
  const [businessInsights, setBusinessInsights] = useState<any>(null);
  const [marketingContent, setMarketingContent] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [marketingType, setMarketingType] = useState<'social' | 'email' | 'sms'>('social');
  const [marketingContext, setMarketingContext] = useState('{}');
  const [testLoading, setTestLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    loadConfiguration();
    loadStats();
  }, []);

  const loadConfiguration = async () => {
    try {
      const { data, error } = await supabase
        .from('integracoes')
        .select('*')
        .eq('tipo', 'ai')
        .single();

      if (data && !error) {
        setConfig(data.configuracao);
        setIsConfigured(data.ativo);
        if (data.ativo) {
          await loadConversations();
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configuração AI:', error);
    }
  };

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversas_ai')
        .select(`
          *,
          usuario:usuarios(nome, email)
        `)
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    }
  };

  const loadStats = async () => {
    try {
      // Total conversations
      const { count: totalCount } = await supabase
        .from('conversas_ai')
        .select('*', { count: 'exact', head: true });

      // Active conversations
      const { count: activeCount } = await supabase
        .from('conversas_ai')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Escalated conversations
      const { count: escalatedCount } = await supabase
        .from('conversas_ai')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'escalated');

      setStats({
        totalConversations: totalCount || 0,
        activeConversations: activeCount || 0,
        escalatedConversations: escalatedCount || 0,
        avgResponseTime: 1.2, // Mock data - would calculate from logs
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const saveConfiguration = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('integracoes')
        .upsert({
          tipo: 'ai',
          configuracao: config,
          ativo: true,
          ultima_sincronizacao: new Date().toISOString(),
        });

      if (error) throw error;

      setIsConfigured(true);
      toast.success('Configuração AI salva com sucesso!');
      
      // Initialize service
      await aiService.initialize();
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast.error('Erro ao salvar configuração AI');
    } finally {
      setLoading(false);
    }
  };

  const testAI = async () => {
    if (!testMessage.trim()) {
      toast.error('Digite uma mensagem para testar');
      return;
    }

    setTestLoading(true);
    try {
      // Temporarily set config for testing
      const tempService = new (aiService.constructor as any)();
      tempService.config = config;
      
      const response = await tempService.processMessage('test-user', testMessage);
      setTestResponse(response.response);
      toast.success('Teste realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao testar AI:', error);
      toast.error('Erro ao testar AI. Verifique as configurações.');
      setTestResponse('Erro: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setTestLoading(false);
    }
  };

  const handleTestMessage = async () => {
    if (!testMessage.trim()) return;

    setTestLoading(true);
    try {
      const response = await aiService.processMessage(
        'test-user',
        testMessage,
        'text'
      );
      setTestResponse(response.response);
    } catch (error) {
      setTestResponse('Erro ao processar mensagem: ' + (error as Error).message);
    } finally {
      setTestLoading(false);
    }
  };

  const handleOptimizeSchedule = async () => {
    if (!user?.barbearia_id) return;

    setLoading(true);
    try {
      const optimization = await aiService.optimizeSchedule(user.barbearia_id, selectedDate);
      setScheduleOptimization(optimization);
    } catch (error) {
      console.error('Erro ao otimizar agenda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecommendations = async () => {
    if (!selectedUserId) return;

    setLoading(true);
    try {
      const recommendations = await aiService.generatePersonalizedRecommendations(selectedUserId);
      setPersonalizedRecommendations(recommendations);
    } catch (error) {
      console.error('Erro ao gerar recomendações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeInsights = async () => {
    if (!user?.barbearia_id) return;

    setLoading(true);
    try {
      const insights = await aiService.analyzeBusinessInsights(user.barbearia_id, selectedPeriod);
      setBusinessInsights(insights);
    } catch (error) {
      console.error('Erro ao analisar insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMarketing = async () => {
    if (!user?.barbearia_id) return;

    setLoading(true);
    try {
      const context = JSON.parse(marketingContext);
      const content = await aiService.generateMarketingContent(user.barbearia_id, marketingType, context);
      setMarketingContent(content);
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSystemPrompt = () => {
    return `Você é um assistente virtual especializado em atendimento para barbearias.
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

Quando não conseguir resolver um problema ou o cliente demonstrar insatisfação, 
ofereça escalar para atendimento humano.`;
  };

  const loadDefaultPrompt = () => {
    setConfig({ ...config, systemPrompt: getDefaultSystemPrompt() });
  };

  const getModelOptions = () => {
    if (config.provider === 'openai') {
      return [
        { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
        { value: 'gpt-4', label: 'GPT-4' },
        { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
      ];
    } else {
      return [
        { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
        { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
        { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
      ];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'resolved':
        return 'bg-blue-100 text-blue-800';
      case 'escalated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={className}>
      <div className="space-y-6">
        <Tabs defaultValue="config" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="config">Configuração</TabsTrigger>
            <TabsTrigger value="test">Teste</TabsTrigger>
            <TabsTrigger value="conversations">Conversas</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="schedule">Otimização</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
          </TabsList>
          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Configuração AI
                </CardTitle>
                <CardDescription>
                  Configure o assistente virtual com IA para atendimento automatizado
                </CardDescription>
              </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Provedor de IA</Label>
                <Select 
                  value={config.provider} 
                  onValueChange={(value: 'openai' | 'anthropic') => 
                    setConfig({ ...config, provider: value, model: value === 'openai' ? 'gpt-3.5-turbo' : 'claude-3-haiku-20240307' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Select 
                  value={config.model} 
                  onValueChange={(value) => setConfig({ ...config, model: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getModelOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder={config.provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxTokens">Máximo de Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  min="100"
                  max="4000"
                  value={config.maxTokens}
                  onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperatura (Criatividade)</Label>
                <Input
                  id="temperature"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.temperature}
                  onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="systemPrompt">Prompt do Sistema</Label>
                <Button variant="outline" size="sm" onClick={loadDefaultPrompt}>
                  Carregar Padrão
                </Button>
              </div>
              <Textarea
                id="systemPrompt"
                placeholder="Instruções para o assistente virtual..."
                rows={8}
                value={config.systemPrompt}
                onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={saveConfiguration} 
                disabled={loading || !config.apiKey || !config.systemPrompt}
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                Salvar Configuração
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test AI */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Testar Assistente
            </CardTitle>
            <CardDescription>
              Teste o assistente virtual com uma mensagem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testMessage">Mensagem de Teste</Label>
              <Textarea
                id="testMessage"
                placeholder="Digite uma mensagem para testar o assistente..."
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={testAI} 
              disabled={testLoading || !testMessage.trim() || !config.apiKey}
            >
              {testLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Enviar Teste
            </Button>

            {testResponse && (
              <div className="space-y-2">
                <Label>Resposta do Assistente</Label>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{testResponse}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {isConfigured && (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalConversations}</p>
                      <p className="text-xs text-muted-foreground">Total de Conversas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.activeConversations}</p>
                      <p className="text-xs text-muted-foreground">Conversas Ativas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.escalatedConversations}</p>
                      <p className="text-xs text-muted-foreground">Escaladas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.avgResponseTime}s</p>
                      <p className="text-xs text-muted-foreground">Tempo Médio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Conversations */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Conversas Recentes</CardTitle>
                    <CardDescription>
                      Últimas conversas do assistente virtual
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={loadConversations}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {conversations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma conversa encontrada</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {conversations.map((conversation) => (
                      <div key={conversation.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">
                              {conversation.usuario?.nome || 'Usuário Anônimo'}
                            </p>
                            <Badge className={getStatusColor(conversation.status)}>
                              {conversation.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {conversation.messages?.length || 0} mensagens • {' '}
                            {new Date(conversation.updated_at).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {conversation.status === 'escalated' && (
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          )}
                          {conversation.status === 'resolved' && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
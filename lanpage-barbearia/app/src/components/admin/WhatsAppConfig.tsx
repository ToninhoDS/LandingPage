import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TouchButton from '@/components/mobile/TouchButton';
import { MessageSquare, Settings, Send, Eye, Plus, History, BarChart3, Webhook } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { whatsappService } from '@/services/whatsapp';
import { toast } from 'sonner';

interface WhatsAppConfigProps {
  barbeariaId: string;
}

export function WhatsAppConfig({ barbeariaId }: WhatsAppConfigProps) {
  const [config, setConfig] = useState({
    phoneNumberId: '',
    accessToken: '',
    webhookVerifyToken: '',
  });
  const [templates, setTemplates] = useState([]);
  const [messageHistory, setMessageHistory] = useState([]);
  const [messageStats, setMessageStats] = useState(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testMessage, setTestMessage] = useState({
    to: '',
    message: '',
  });
  const [interactiveTest, setInteractiveTest] = useState({
    to: '',
    body: '',
    buttons: [
      { id: 'btn1', title: 'Sim' },
      { id: 'btn2', title: 'Não' },
    ],
  });

  useEffect(() => {
    loadConfiguration();
    loadTemplates();
    loadMessageHistory();
    loadMessageStats();
  }, [barbeariaId]);

  const loadConfiguration = async () => {
    try {
      const { data } = await supabase
        .from('integracoes')
        .select('configuracao, ativo')
        .eq('barbearia_id', barbeariaId)
        .eq('tipo', 'whatsapp')
        .single();

      if (data) {
        setConfig(data.configuracao);
        setIsConfigured(data.ativo);
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  };

  const loadTemplates = async () => {
    const templatesData = await whatsappService.getTemplates(barbeariaId);
    setTemplates(templatesData);
  };

  const loadMessageHistory = async () => {
    const history = await whatsappService.getMessageHistory(barbeariaId, 20);
    setMessageHistory(history);
  };

  const loadMessageStats = async () => {
    const stats = await whatsappService.getMessageStats(barbeariaId);
    setMessageStats(stats);
  };

  const saveConfiguration = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('integracoes')
        .upsert({
          barbearia_id: barbeariaId,
          tipo: 'whatsapp',
          configuracao: config,
          ativo: true,
        });

      if (error) throw error;

      setIsConfigured(true);
      toast.success('Configuração do WhatsApp salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast.error('Erro ao salvar configuração do WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  const testWhatsApp = async () => {
    if (!testMessage.to || !testMessage.message) {
      toast.error('Preencha o número e a mensagem para teste');
      return;
    }

    setLoading(true);
    try {
      const success = await whatsappService.sendTextMessage(
        testMessage.to,
        testMessage.message,
        barbeariaId
      );

      if (success) {
        toast.success('Mensagem de teste enviada com sucesso!');
        setTestMessage({ to: '', message: '' });
        loadMessageHistory();
      } else {
        toast.error('Falha ao enviar mensagem de teste');
      }
    } catch (error) {
      console.error('Erro no teste:', error);
      toast.error('Erro ao testar WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  const testInteractiveMessage = async () => {
    if (!interactiveTest.to || !interactiveTest.body) {
      toast.error('Preencha o número e a mensagem para teste');
      return;
    }

    setLoading(true);
    try {
      const success = await whatsappService.sendInteractiveMessage(
        interactiveTest.to,
        interactiveTest.body,
        interactiveTest.buttons,
        barbeariaId,
        'Teste de Mensagem Interativa',
        'Barbearia Digital'
      );

      if (success) {
        toast.success('Mensagem interativa enviada com sucesso!');
        setInteractiveTest({
          to: '',
          body: '',
          buttons: [
            { id: 'btn1', title: 'Sim' },
            { id: 'btn2', title: 'Não' },
          ],
        });
        loadMessageHistory();
      } else {
        toast.error('Falha ao enviar mensagem interativa');
      }
    } catch (error) {
      console.error('Erro no teste:', error);
      toast.error('Erro ao testar mensagem interativa');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultTemplates = async () => {
    setLoading(true);
    try {
      const defaultTemplates = [
        {
          nome: 'Confirmação de Agendamento',
          template_id: 'confirmacao_agendamento',
          categoria: 'confirmacao',
          conteudo: {
            header: 'Agendamento Confirmado ✅',
            body: 'Olá {{1}}! Seu agendamento com {{2}} foi confirmado para {{3}}. Serviços: {{4}}',
            footer: 'Barbearia Digital',
          },
        },
        {
          nome: 'Lembrete de Agendamento',
          template_id: 'lembrete_agendamento',
          categoria: 'lembrete',
          conteudo: {
            header: 'Lembrete de Agendamento ⏰',
            body: 'Olá {{1}}! Lembramos que você tem agendamento com {{2}} amanhã às {{3}}.',
            footer: 'Barbearia Digital',
          },
        },
        {
          nome: 'Promoção',
          template_id: 'promocao',
          categoria: 'promocao',
          conteudo: {
            header: 'Oferta Especial! 🎉',
            body: 'Olá {{1}}! Temos uma promoção especial para você: {{2}}',
            footer: 'Barbearia Digital',
          },
        },
        {
          nome: 'Cancelamento de Agendamento',
          template_id: 'cancelamento_agendamento',
          categoria: 'cancelamento',
          conteudo: {
            header: 'Agendamento Cancelado ❌',
            body: 'Olá {{1}}! Seu agendamento com {{2}} para {{3}} foi cancelado. Entre em contato para reagendar.',
            footer: 'Barbearia Digital',
          },
        },
        {
          nome: 'Feedback Pós-Atendimento',
          template_id: 'feedback_atendimento',
          categoria: 'feedback',
          conteudo: {
            header: 'Como foi seu atendimento? ⭐',
            body: 'Olá {{1}}! Esperamos que tenha gostado do atendimento com {{2}}. Sua opinião é muito importante para nós!',
            footer: 'Barbearia Digital',
          },
        },
      ];

      for (const template of defaultTemplates) {
        await whatsappService.createTemplate(barbeariaId, template);
      }

      await loadTemplates();
      toast.success('Templates padrão criados com sucesso!');
    } catch (error) {
      console.error('Erro ao criar templates:', error);
      toast.error('Erro ao criar templates padrão');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const getWebhookUrl = () => {
    return `${window.location.origin}/api/webhooks/whatsapp`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-6 w-6 text-green-600" />
        <h2 className="text-xl font-semibold">Configuração WhatsApp Business</h2>
        {isConfigured && (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Configurado
          </Badge>
        )}
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="config">
            <Settings className="h-4 w-4 mr-2" />
            Config
          </TabsTrigger>
          <TabsTrigger value="webhook">
            <Webhook className="h-4 w-4 mr-2" />
            Webhook
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Eye className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="test">
            <Send className="h-4 w-4 mr-2" />
            Teste
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="h-4 w-4 mr-2" />
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="phoneNumberId">Phone Number ID</Label>
                <Input
                  id="phoneNumberId"
                  value={config.phoneNumberId}
                  onChange={(e) => setConfig({ ...config, phoneNumberId: e.target.value })}
                  placeholder="ID do número de telefone do WhatsApp Business"
                />
              </div>

              <div>
                <Label htmlFor="accessToken">Access Token</Label>
                <Input
                  id="accessToken"
                  type="password"
                  value={config.accessToken}
                  onChange={(e) => setConfig({ ...config, accessToken: e.target.value })}
                  placeholder="Token de acesso do WhatsApp Business API"
                />
              </div>

              <div>
                <Label htmlFor="webhookVerifyToken">Webhook Verify Token</Label>
                <Input
                  id="webhookVerifyToken"
                  value={config.webhookVerifyToken}
                  onChange={(e) => setConfig({ ...config, webhookVerifyToken: e.target.value })}
                  placeholder="Token de verificação do webhook"
                />
              </div>

              <TouchButton
                onClick={saveConfiguration}
                loading={loading}
                className="w-full"
              >
                Salvar Configuração
              </TouchButton>
            </div>
          </Card>

          <Card className="p-6 bg-blue-50">
            <h3 className="font-medium mb-2">Como configurar:</h3>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Acesse o Facebook Business Manager</li>
              <li>2. Configure o WhatsApp Business API</li>
              <li>3. Obtenha o Phone Number ID e Access Token</li>
              <li>4. Gere um Webhook Verify Token único</li>
              <li>5. Configure o webhook na aba "Webhook"</li>
              <li>6. Cole as informações acima e salve</li>
            </ol>
          </Card>
        </TabsContent>

        <TabsContent value="webhook" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-medium mb-4">Configuração do Webhook</h3>
            <div className="space-y-4">
              <div>
                <Label>URL do Webhook</Label>
                <div className="flex gap-2">
                  <Input
                    value={getWebhookUrl()}
                    readOnly
                    className="bg-gray-50"
                  />
                  <Button
                    onClick={() => navigator.clipboard.writeText(getWebhookUrl())}
                    variant="outline"
                    size="sm"
                  >
                    Copiar
                  </Button>
                </div>
              </div>

              <div>
                <Label>Verify Token</Label>
                <Input
                  value={config.webhookVerifyToken}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-2">Instruções:</h4>
                <ol className="text-sm text-amber-700 space-y-1">
                  <li>1. Acesse o Facebook Developer Console</li>
                  <li>2. Vá para WhatsApp → Configuration → Webhooks</li>
                  <li>3. Cole a URL do webhook acima</li>
                  <li>4. Use o Verify Token configurado</li>
                  <li>5. Selecione os eventos: messages, message_deliveries</li>
                  <li>6. Clique em "Verify and Save"</li>
                </ol>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Templates de Mensagem</h3>
            <TouchButton
              onClick={createDefaultTemplates}
              loading={loading}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Templates Padrão
            </TouchButton>
          </div>

          <div className="grid gap-4">
            {templates.map((template: any) => (
              <Card key={template.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{template.nome}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      ID: {template.template_id}
                    </p>
                    <Badge variant="outline" className="mt-2">
                      {template.categoria}
                    </Badge>
                  </div>
                  <Badge variant={template.ativo ? 'default' : 'secondary'}>
                    {template.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          {templates.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Nenhum template configurado</p>
              <p className="text-sm text-gray-400 mt-1">
                Clique em "Criar Templates Padrão" para começar
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-medium mb-4">Teste de Mensagem Simples</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="testTo">Número de WhatsApp (com código do país)</Label>
                <Input
                  id="testTo"
                  value={testMessage.to}
                  onChange={(e) => setTestMessage({ ...testMessage, to: e.target.value })}
                  placeholder="5511999999999"
                />
              </div>

              <div>
                <Label htmlFor="testMessage">Mensagem de Teste</Label>
                <Input
                  id="testMessage"
                  value={testMessage.message}
                  onChange={(e) => setTestMessage({ ...testMessage, message: e.target.value })}
                  placeholder="Mensagem de teste do sistema"
                />
              </div>

              <TouchButton
                onClick={testWhatsApp}
                loading={loading}
                disabled={!isConfigured}
                className="w-full"
              >
                Enviar Teste
              </TouchButton>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-medium mb-4">Teste de Mensagem Interativa</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="interactiveTo">Número de WhatsApp</Label>
                <Input
                  id="interactiveTo"
                  value={interactiveTest.to}
                  onChange={(e) => setInteractiveTest({ ...interactiveTest, to: e.target.value })}
                  placeholder="5511999999999"
                />
              </div>

              <div>
                <Label htmlFor="interactiveBody">Mensagem</Label>
                <Input
                  id="interactiveBody"
                  value={interactiveTest.body}
                  onChange={(e) => setInteractiveTest({ ...interactiveTest, body: e.target.value })}
                  placeholder="Você gostaria de agendar um horário?"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Botão 1</Label>
                  <Input
                    value={interactiveTest.buttons[0]?.title || ''}
                    onChange={(e) => {
                      const newButtons = [...interactiveTest.buttons];
                      newButtons[0] = { ...newButtons[0], title: e.target.value };
                      setInteractiveTest({ ...interactiveTest, buttons: newButtons });
                    }}
                    placeholder="Sim"
                  />
                </div>
                <div>
                  <Label>Botão 2</Label>
                  <Input
                    value={interactiveTest.buttons[1]?.title || ''}
                    onChange={(e) => {
                      const newButtons = [...interactiveTest.buttons];
                      newButtons[1] = { ...newButtons[1], title: e.target.value };
                      setInteractiveTest({ ...interactiveTest, buttons: newButtons });
                    }}
                    placeholder="Não"
                  />
                </div>
              </div>

              <TouchButton
                onClick={testInteractiveMessage}
                loading={loading}
                disabled={!isConfigured}
                className="w-full"
              >
                Enviar Teste Interativo
              </TouchButton>
            </div>
          </Card>

          {!isConfigured && (
            <Card className="p-4 bg-amber-50">
              <p className="text-sm text-amber-600">
                Configure o WhatsApp primeiro para poder testar
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Histórico de Mensagens</h3>
            <TouchButton
              onClick={loadMessageHistory}
              size="sm"
              variant="outline"
            >
              Atualizar
            </TouchButton>
          </div>

          <div className="space-y-2">
            {messageHistory.map((message: any) => (
              <Card key={message.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={message.direction === 'sent' ? 'default' : 'secondary'}>
                        {message.direction === 'sent' ? 'Enviada' : 'Recebida'}
                      </Badge>
                      <Badge variant="outline">
                        {message.message_type}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {message.direction === 'sent' ? message.to_number : message.from_number}
                      </span>
                    </div>
                    <p className="text-sm">{message.message_content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                  <Badge variant={
                    message.status === 'delivered' ? 'default' :
                    message.status === 'read' ? 'default' :
                    message.status === 'failed' ? 'destructive' : 'secondary'
                  }>
                    {message.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          {messageHistory.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Nenhuma mensagem encontrada</p>
              <p className="text-sm text-gray-400 mt-1">
                As mensagens aparecerão aqui após serem enviadas ou recebidas
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Estatísticas (Últimos 30 dias)</h3>
            <TouchButton
              onClick={loadMessageStats}
              size="sm"
              variant="outline"
            >
              Atualizar
            </TouchButton>
          </div>

          {messageStats && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{messageStats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{messageStats.sent}</div>
                <div className="text-sm text-gray-600">Enviadas</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{messageStats.received}</div>
                <div className="text-sm text-gray-600">Recebidas</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-teal-600">{messageStats.delivered}</div>
                <div className="text-sm text-gray-600">Entregues</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600">{messageStats.read}</div>
                <div className="text-sm text-gray-600">Lidas</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{messageStats.failed}</div>
                <div className="text-sm text-gray-600">Falharam</div>
              </Card>
            </div>
          )}

          {!messageStats && (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Carregando estatísticas...</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default WhatsAppConfig;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Play, 
  Pause, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Edit,
  Activity,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Users,
  ShoppingCart,
  MessageSquare,
  Calendar,
  Package
} from 'lucide-react';
import { n8nService, N8NWorkflow, N8NExecution, AutomationRule } from '@/services/n8n';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface N8NConfigProps {
  className?: string;
}

export default function N8NConfig({ className }: N8NConfigProps) {
  const [config, setConfig] = useState({
    baseUrl: '',
    apiKey: '',
    webhookUrl: '',
  });
  const [workflows, setWorkflows] = useState<N8NWorkflow[]>([]);
  const [executions, setExecutions] = useState<N8NExecution[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [activeTab, setActiveTab] = useState('config');
  const [testResult, setTestResult] = useState<string>('');
  const [workflowStats, setWorkflowStats] = useState({
    total: 0,
    active: 0,
    executions_today: 0,
    success_rate: 0,
  });

  // New automation rule form
  const [newRule, setNewRule] = useState({
    name: '',
    trigger: {
      type: 'appointment',
      conditions: {},
    },
    actions: [],
    active: true,
  });

  useEffect(() => {
    loadConfiguration();
    loadAutomationRules();
    loadWorkflowStats();
  }, []);

  const loadConfiguration = async () => {
    try {
      const { data, error } = await supabase
        .from('integracoes')
        .select('*')
        .eq('tipo', 'n8n')
        .single();

      if (data && !error) {
        setConfig(data.configuracao);
        setIsConfigured(data.ativo);
        if (data.ativo) {
          await loadWorkflows();
          await loadExecutions();
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configuração N8N:', error);
    }
  };

  const saveConfiguration = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('integracoes')
        .upsert({
          tipo: 'n8n',
          configuracao: config,
          ativo: true,
          ultima_sincronizacao: new Date().toISOString(),
        });

      if (error) throw error;

      setIsConfigured(true);
      toast.success('Configuração N8N salva com sucesso!');
      
      // Initialize service and load workflows
      await n8nService.initialize();
      await loadWorkflows();
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast.error('Erro ao salvar configuração N8N');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setTestLoading(true);
    try {
      // Temporarily set config for testing
      const tempService = new (n8nService.constructor as any)();
      tempService.config = config;
      
      const workflows = await tempService.getWorkflows();
      toast.success(`Conexão bem-sucedida! Encontrados ${workflows.length} workflows.`);
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      toast.error('Erro ao conectar com N8N. Verifique as configurações.');
    } finally {
      setTestLoading(false);
    }
  };

  const loadWorkflows = async () => {
    try {
      await n8nService.initialize();
      const workflowList = await n8nService.getWorkflows();
      setWorkflows(workflowList);
    } catch (error) {
      console.error('Erro ao carregar workflows:', error);
      toast.error('Erro ao carregar workflows');
    }
  };

  const loadExecutions = async () => {
    try {
      await n8nService.initialize();
      const executionList = await n8nService.getExecutions();
      setExecutions(executionList.slice(0, 10)); // Show last 10 executions
    } catch (error) {
      console.error('Erro ao carregar execuções:', error);
    }
  };

  const loadAutomationRules = async () => {
    try {
      const barbeariaId = localStorage.getItem('barbearia_id');
      if (!barbeariaId) return;

      const rules = await n8nService.getAutomationRules(barbeariaId);
      setAutomationRules(rules);
    } catch (error) {
      console.error('Erro ao carregar regras de automação:', error);
    }
  };

  const loadWorkflowStats = async () => {
    try {
      const workflowList = await n8nService.getWorkflows();
      const executionList = await n8nService.getExecutions();
      
      const today = new Date().toDateString();
      const todayExecutions = executionList.filter(
        exec => new Date(exec.startedAt).toDateString() === today
      );
      
      const successfulExecutions = executionList.filter(
        exec => exec.status === 'success'
      );

      setWorkflowStats({
        total: workflowList.length,
        active: workflowList.filter(w => w.active).length,
        executions_today: todayExecutions.length,
        success_rate: executionList.length > 0 
          ? Math.round((successfulExecutions.length / executionList.length) * 100)
          : 0,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const toggleWorkflow = async (workflowId: string, active: boolean) => {
    try {
      if (active) {
        await n8nService.deactivateWorkflow(workflowId);
      } else {
        await n8nService.activateWorkflow(workflowId);
      }
      
      await loadWorkflows();
      toast.success(`Workflow ${active ? 'desativado' : 'ativado'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao alterar status do workflow:', error);
      toast.error('Erro ao alterar status do workflow');
    }
  };

  const createDefaultWorkflows = async () => {
    setLoading(true);
    try {
      await n8nService.createAllDefaultWorkflows();
      toast.success('Workflows padrão criados com sucesso!');
      await loadWorkflows();
    } catch (error) {
      console.error('Erro ao criar workflows padrão:', error);
      toast.error('Erro ao criar workflows padrão');
    } finally {
      setLoading(false);
    }
  };

  const executeWorkflow = async (workflowId: string) => {
    try {
      await n8nService.executeWorkflow(workflowId, {
        test: true,
        timestamp: new Date().toISOString(),
      });
      
      await loadExecutions();
      toast.success('Workflow executado com sucesso!');
    } catch (error) {
      console.error('Erro ao executar workflow:', error);
      toast.error('Erro ao executar workflow');
    }
  };

  const createAutomationRule = async () => {
    try {
      setLoading(true);
      const barbeariaId = localStorage.getItem('barbearia_id');
      if (!barbeariaId) {
        toast.error('ID da barbearia não encontrado');
        return;
      }

      await n8nService.createAutomationRule({
        ...newRule,
        barbeariaId,
      });

      toast.success('Regra de automação criada com sucesso!');
      setNewRule({
        name: '',
        trigger: { type: 'appointment', conditions: {} },
        actions: [],
        active: true,
      });
      await loadAutomationRules();
    } catch (error) {
      console.error('Erro ao criar regra:', error);
      toast.error('Erro ao criar regra de automação');
    } finally {
      setLoading(false);
    }
  };

  const deleteAutomationRule = async (ruleId: string) => {
    try {
      await n8nService.deleteAutomationRule(ruleId);
      toast.success('Regra removida com sucesso!');
      await loadAutomationRules();
    } catch (error) {
      console.error('Erro ao remover regra:', error);
      toast.error('Erro ao remover regra');
    }
  };

  const toggleAutomationRule = async (ruleId: string, active: boolean) => {
    try {
      await n8nService.updateAutomationRule(ruleId, { active });
      toast.success(`Regra ${active ? 'ativada' : 'desativada'} com sucesso!`);
      await loadAutomationRules();
    } catch (error) {
      console.error('Erro ao atualizar regra:', error);
      toast.error('Erro ao atualizar regra');
    }
  };

  const triggerTestWorkflow = async (type: string) => {
    try {
      setLoading(true);
      const testData = {
        id: 'test-' + Date.now(),
        cliente: { nome: 'Cliente Teste', telefone: '+5511999999999' },
        servico: { nome: 'Corte + Barba', duracao: 60 },
        data_hora: new Date().toISOString(),
        valor_total: 50.00,
        barbearia_id: localStorage.getItem('barbearia_id'),
      };

      switch (type) {
        case 'appointment':
          await n8nService.triggerNewAppointmentWorkflow(testData);
          break;
        case 'reminder':
          await n8nService.triggerAppointmentReminderWorkflow(testData);
          break;
        case 'customer':
          await n8nService.triggerCustomerLifecycleWorkflow(testData, 'registered');
          break;
        default:
          throw new Error('Tipo de teste não suportado');
      }

      toast.success('Workflow de teste executado com sucesso!');
      setTestResult(`Workflow ${type} executado com sucesso às ${new Date().toLocaleTimeString()}`);
      await loadExecutions();
    } catch (error) {
      console.error('Erro ao executar teste:', error);
      toast.error('Erro ao executar workflow de teste');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'waiting':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-4 w-4" />;
      case 'customer':
        return <Users className="h-4 w-4" />;
      case 'payment':
        return <ShoppingCart className="h-4 w-4" />;
      case 'feedback':
        return <MessageSquare className="h-4 w-4" />;
      case 'inventory':
        return <Package className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className={className}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Configuração N8N</h2>
            <p className="text-muted-foreground">
              Configure automações e workflows para sua barbearia
            </p>
          </div>
          <Button onClick={createDefaultWorkflows} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Workflows Padrão
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Workflows</p>
                  <p className="text-2xl font-bold">{workflowStats.total}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Workflows Ativos</p>
                  <p className="text-2xl font-bold">{workflowStats.active}</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Execuções Hoje</p>
                  <p className="text-2xl font-bold">{workflowStats.executions_today}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold">{workflowStats.success_rate}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="config">Configuração</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="executions">Execuções</TabsTrigger>
            <TabsTrigger value="automation">Automação</TabsTrigger>
            <TabsTrigger value="testing">Testes</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Configuração N8N
                </CardTitle>
                <CardDescription>
                  Configure a integração com N8N para automação de processos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseUrl">URL Base do N8N</Label>
                    <Input
                      id="baseUrl"
                      placeholder="https://n8n.exemplo.com"
                      value={config.baseUrl}
                      onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="n8n_api_key_here"
                      value={config.apiKey}
                      onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">URL de Webhook (Opcional)</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://n8n.exemplo.com/webhook"
                    value={config.webhookUrl}
                    onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={saveConfiguration} 
                    disabled={loading || !config.baseUrl || !config.apiKey}
                  >
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    Salvar Configuração
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={testConnection}
                    disabled={testLoading || !config.baseUrl || !config.apiKey}
                  >
                    {testLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    Testar Conexão
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Workflows</CardTitle>
                    <CardDescription>
                      Gerencie os workflows de automação
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={loadWorkflows}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Atualizar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {workflows.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum workflow encontrado</p>
                    <p className="text-sm">Clique em "Criar Workflows Padrão" para começar</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workflows.map((workflow) => (
                      <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{workflow.name}</h4>
                            <Badge variant={workflow.active ? "default" : "secondary"}>
                              {workflow.active ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {workflow.nodes?.length || 0} nós configurados
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => executeWorkflow(workflow.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleWorkflow(workflow.id, workflow.active)}
                          >
                            {workflow.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="executions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Execuções Recentes</CardTitle>
                    <CardDescription>
                      Últimas execuções dos workflows
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={loadExecutions}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {executions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma execução encontrada</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {executions.map((execution) => (
                      <div key={execution.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(execution.status)}
                          <div>
                            <p className="font-medium text-sm">Workflow {execution.workflowId}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(execution.startedAt).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(execution.status)}>
                          {execution.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Regras de Automação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Create New Rule Form */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Nova Regra de Automação</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rule-name">Nome da Regra</Label>
                      <Input
                        id="rule-name"
                        value={newRule.name}
                        onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                        placeholder="Ex: Lembrete de agendamento"
                      />
                    </div>

                    <div>
                      <Label htmlFor="trigger-type">Tipo de Gatilho</Label>
                      <Select
                        value={newRule.trigger.type}
                        onValueChange={(value) => 
                          setNewRule({ 
                            ...newRule, 
                            trigger: { ...newRule.trigger, type: value }
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="appointment">Agendamento</SelectItem>
                          <SelectItem value="customer">Cliente</SelectItem>
                          <SelectItem value="payment">Pagamento</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="inventory">Estoque</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newRule.active}
                      onCheckedChange={(checked) => 
                        setNewRule({ ...newRule, active: checked })
                      }
                    />
                    <Label>Ativar regra imediatamente</Label>
                  </div>

                  <Button onClick={createAutomationRule} disabled={loading || !newRule.name}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Regra
                  </Button>
                </div>

                {/* Existing Rules List */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Regras Existentes</h3>
                  {automationRules.length === 0 ? (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Nenhuma regra de automação configurada.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    automationRules.map((rule) => (
                      <Card key={rule.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getTriggerIcon(rule.trigger.type)}
                              <div>
                                <h4 className="font-medium">{rule.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Gatilho: {rule.trigger.type}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant={rule.active ? 'default' : 'secondary'}>
                                {rule.active ? 'Ativo' : 'Inativo'}
                              </Badge>
                              
                              <Switch
                                checked={rule.active}
                                onCheckedChange={(checked) => 
                                  toggleAutomationRule(rule.id, checked)
                                }
                              />
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteAutomationRule(rule.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Testes de Workflow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Use os botões abaixo para testar diferentes tipos de workflows com dados fictícios.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <h3 className="font-semibold mb-2">Novo Agendamento</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Testa o workflow de confirmação de agendamento
                      </p>
                      <Button 
                        onClick={() => triggerTestWorkflow('appointment')}
                        disabled={loading}
                        className="w-full"
                      >
                        Testar
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                      <h3 className="font-semibold mb-2">Lembrete</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Testa o workflow de lembrete de agendamento
                      </p>
                      <Button 
                        onClick={() => triggerTestWorkflow('reminder')}
                        disabled={loading}
                        className="w-full"
                      >
                        Testar
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <h3 className="font-semibold mb-2">Novo Cliente</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Testa o workflow de boas-vindas para novos clientes
                      </p>
                      <Button 
                        onClick={() => triggerTestWorkflow('customer')}
                        disabled={loading}
                        className="w-full"
                      >
                        Testar
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {testResult && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{testResult}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
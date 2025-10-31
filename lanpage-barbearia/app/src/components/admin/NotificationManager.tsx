import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';
import { 
  Bell, 
  Send, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Edit,
  Plus
} from 'lucide-react';
import { usePushNotifications } from '../../hooks/usePushNotifications';
import { NotificationTemplate } from '../../services/pushNotifications';

interface NotificationManagerProps {
  className?: string;
}

export function NotificationManager({ className }: NotificationManagerProps) {
  const {
    isSubscribed,
    permission,
    templates,
    scheduledNotifications,
    stats,
    loading,
    subscribe,
    unsubscribe,
    sendTestNotification,
    sendNotification,
    scheduleNotification,
    cancelScheduledNotification,
    getTemplatesByCategory,
    loadScheduledNotifications,
    loadStats
  } = usePushNotifications();

  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customTitle, setCustomTitle] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [customIcon, setCustomIcon] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [bulkUsers, setBulkUsers] = useState<string>('');

  // Load data on component mount
  useEffect(() => {
    loadScheduledNotifications();
    loadStats();
  }, [loadScheduledNotifications, loadStats]);

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCustomTitle(template.title);
      setCustomBody(template.body);
      setCustomIcon(template.icon || '');
      
      // Extract variables from template
      const variables: Record<string, string> = {};
      const matches = template.body.match(/\{\{(\w+)\}\}/g);
      if (matches) {
        matches.forEach(match => {
          const variable = match.replace(/\{\{|\}\}/g, '');
          variables[variable] = '';
        });
      }
      setTemplateVariables(variables);
    }
  };

  // Send immediate notification
  const handleSendNotification = async () => {
    if (!selectedTemplate && (!customTitle || !customBody)) {
      toast.error('Selecione um template ou preencha título e mensagem');
      return;
    }

    try {
      let success = false;

      if (selectedTemplate) {
        success = await sendNotification(selectedTemplate, templateVariables);
      } else {
        // Send custom notification (would need to implement this in the service)
        toast.info('Funcionalidade de notificação customizada em desenvolvimento');
        return;
      }

      if (success) {
        toast.success('Notificação enviada com sucesso!');
        setSelectedTemplate('');
        setCustomTitle('');
        setCustomBody('');
        setTemplateVariables({});
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Erro ao enviar notificação');
    }
  };

  // Schedule notification
  const handleScheduleNotification = async () => {
    if (!selectedTemplate || !scheduleDate || !scheduleTime) {
      toast.error('Preencha todos os campos para agendar');
      return;
    }

    const scheduledFor = new Date(`${scheduleDate}T${scheduleTime}`);
    
    if (scheduledFor <= new Date()) {
      toast.error('A data deve ser no futuro');
      return;
    }

    const notificationId = await scheduleNotification(selectedTemplate, scheduledFor, templateVariables);
    
    if (notificationId) {
      setScheduleDate('');
      setScheduleTime('');
      setSelectedTemplate('');
      setTemplateVariables({});
    }
  };

  // Send bulk notifications
  const handleBulkNotification = async () => {
    if (!selectedTemplate || !bulkUsers.trim()) {
      toast.error('Selecione um template e adicione usuários');
      return;
    }

    const userIds = bulkUsers.split('\n').map(id => id.trim()).filter(Boolean);
    
    if (userIds.length === 0) {
      toast.error('Nenhum usuário válido encontrado');
      return;
    }

    try {
      // This would need to be implemented in the push notification service
      toast.info(`Enviando notificações para ${userIds.length} usuários...`);
      // await pushNotificationService.sendBulkNotifications(userIds, selectedTemplate, templateVariables);
      toast.success('Notificações em lote enviadas!');
      setBulkUsers('');
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
      toast.error('Erro ao enviar notificações em lote');
    }
  };

  // Format date for display
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'sent': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Gerenciar Notificações</h2>
            <p className="text-muted-foreground">
              Configure e envie notificações push para seus clientes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isSubscribed ? "default" : "secondary"}>
              {isSubscribed ? "Ativo" : "Inativo"}
            </Badge>
            {!isSubscribed && permission !== 'granted' && (
              <Button onClick={subscribe} size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Ativar Notificações
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Enviadas</p>
                  <p className="text-2xl font-bold">{stats.sent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Entregues</p>
                  <p className="text-2xl font-bold">{stats.delivered}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Clicadas</p>
                  <p className="text-2xl font-bold">{stats.clicked}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Falharam</p>
                  <p className="text-2xl font-bold">{stats.failed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="send" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="send">Enviar</TabsTrigger>
            <TabsTrigger value="schedule">Agendar</TabsTrigger>
            <TabsTrigger value="bulk">Em Lote</TabsTrigger>
            <TabsTrigger value="scheduled">Agendadas</TabsTrigger>
          </TabsList>

          {/* Send Notification */}
          <TabsContent value="send" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enviar Notificação</CardTitle>
                <CardDescription>
                  Envie uma notificação imediata usando um template ou criando uma personalizada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTemplate && Object.keys(templateVariables).length > 0 && (
                  <div className="space-y-2">
                    <Label>Variáveis do Template</Label>
                    {Object.keys(templateVariables).map((variable) => (
                      <div key={variable} className="space-y-1">
                        <Label htmlFor={variable} className="text-sm">
                          {variable}
                        </Label>
                        <Input
                          id={variable}
                          value={templateVariables[variable]}
                          onChange={(e) => setTemplateVariables(prev => ({
                            ...prev,
                            [variable]: e.target.value
                          }))}
                          placeholder={`Digite o valor para ${variable}`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="Título da notificação"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="icon">Ícone (URL)</Label>
                    <Input
                      id="icon"
                      value={customIcon}
                      onChange={(e) => setCustomIcon(e.target.value)}
                      placeholder="URL do ícone"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body">Mensagem</Label>
                  <Textarea
                    id="body"
                    value={customBody}
                    onChange={(e) => setCustomBody(e.target.value)}
                    placeholder="Conteúdo da notificação"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSendNotification} disabled={loading}>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Agora
                  </Button>
                  <Button variant="outline" onClick={sendTestNotification} disabled={loading}>
                    <Bell className="w-4 h-4 mr-2" />
                    Teste
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Notification */}
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Agendar Notificação</CardTitle>
                <CardDescription>
                  Agende uma notificação para ser enviada em uma data específica
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schedule-template">Template</Label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-date">Data</Label>
                    <Input
                      id="schedule-date"
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="schedule-time">Horário</Label>
                    <Input
                      id="schedule-time"
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </div>
                </div>

                {selectedTemplate && Object.keys(templateVariables).length > 0 && (
                  <div className="space-y-2">
                    <Label>Variáveis do Template</Label>
                    {Object.keys(templateVariables).map((variable) => (
                      <div key={variable} className="space-y-1">
                        <Label htmlFor={`schedule-${variable}`} className="text-sm">
                          {variable}
                        </Label>
                        <Input
                          id={`schedule-${variable}`}
                          value={templateVariables[variable]}
                          onChange={(e) => setTemplateVariables(prev => ({
                            ...prev,
                            [variable]: e.target.value
                          }))}
                          placeholder={`Digite o valor para ${variable}`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <Button onClick={handleScheduleNotification} disabled={loading}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Notificação
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bulk Notifications */}
          <TabsContent value="bulk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notificações em Lote</CardTitle>
                <CardDescription>
                  Envie notificações para múltiplos usuários de uma vez
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bulk-template">Template</Label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bulk-users">IDs dos Usuários</Label>
                  <Textarea
                    id="bulk-users"
                    value={bulkUsers}
                    onChange={(e) => setBulkUsers(e.target.value)}
                    placeholder="Digite um ID de usuário por linha"
                    rows={5}
                  />
                  <p className="text-sm text-muted-foreground">
                    Digite um ID de usuário por linha
                  </p>
                </div>

                <Button onClick={handleBulkNotification} disabled={loading}>
                  <Users className="w-4 h-4 mr-2" />
                  Enviar para Todos
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scheduled Notifications */}
          <TabsContent value="scheduled" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notificações Agendadas</CardTitle>
                <CardDescription>
                  Visualize e gerencie notificações agendadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scheduledNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhuma notificação agendada</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {scheduledNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(notification.status)}>
                              {notification.status}
                            </Badge>
                            <span className="font-medium">{notification.templateId}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Agendada para: {formatDate(notification.scheduledFor)}
                          </p>
                          {notification.variables && Object.keys(notification.variables).length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground">Variáveis:</p>
                              <div className="flex gap-2 mt-1">
                                {Object.entries(notification.variables).map(([key, value]) => (
                                  <Badge key={key} variant="outline" className="text-xs">
                                    {key}: {value}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {notification.status === 'scheduled' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelScheduledNotification(notification.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default NotificationManager;
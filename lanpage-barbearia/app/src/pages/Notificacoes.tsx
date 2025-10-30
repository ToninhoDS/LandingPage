import React, { useState } from 'react';
import { Bell, Settings, Check, X, Calendar, MessageSquare, Star, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePWA } from '@/hooks/usePWA';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'appointment' | 'promotion' | 'reminder' | 'rating';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'Agendamento Confirmado',
    message: 'Seu corte com João está confirmado para amanhã às 14:00',
    time: '2 horas atrás',
    read: false,
    icon: <Calendar className="h-5 w-5 text-blue-500" />
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Lembrete de Agendamento',
    message: 'Seu agendamento é em 1 hora. Barbearia Central - Rua das Flores, 123',
    time: '1 hora atrás',
    read: false,
    icon: <Bell className="h-5 w-5 text-orange-500" />
  },
  {
    id: '3',
    type: 'promotion',
    title: 'Promoção Especial!',
    message: '20% de desconto em todos os serviços nesta semana. Aproveite!',
    time: '3 horas atrás',
    read: true,
    icon: <Gift className="h-5 w-5 text-green-500" />
  },
  {
    id: '4',
    type: 'rating',
    title: 'Avalie seu último serviço',
    message: 'Como foi seu corte com Carlos? Sua opinião é importante para nós.',
    time: '1 dia atrás',
    read: true,
    icon: <Star className="h-5 w-5 text-yellow-500" />
  },
  {
    id: '5',
    type: 'appointment',
    title: 'Agendamento Cancelado',
    message: 'Seu agendamento para hoje foi cancelado. Entre em contato para reagendar.',
    time: '2 dias atrás',
    read: true,
    icon: <X className="h-5 w-5 text-red-500" />
  }
];

export default function Notificacoes() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [settings, setSettings] = useState({
    appointments: true,
    promotions: true,
    reminders: true,
    ratings: false,
    sound: true,
    vibration: true
  });
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'settings'>('all');
  
  const { notificationPermission, requestNotificationPermission, showNotification } = usePWA();

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast.success('Todas as notificações foram marcadas como lidas');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.success('Notificação removida');
  };

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Configuração atualizada');
  };

  const testNotification = () => {
    if (notificationPermission === 'granted') {
      showNotification('Teste de Notificação', {
        body: 'Esta é uma notificação de teste da Barbearia App',
        tag: 'test-notification'
      });
    } else {
      requestNotificationPermission();
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'unread') return !notif.read;
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount} notificação{unreadCount !== 1 ? 'ões' : ''} não lida{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <Check className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors relative ${
              activeTab === 'unread'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Não lidas
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="h-4 w-4 inline mr-2" />
            Configurações
          </button>
        </div>

        {/* Content */}
        {activeTab === 'settings' ? (
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Permission Status */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Status das Notificações</h3>
                    <p className="text-sm text-gray-600">
                      {notificationPermission === 'granted' 
                        ? 'Notificações ativadas' 
                        : notificationPermission === 'denied'
                        ? 'Notificações bloqueadas'
                        : 'Notificações não configuradas'
                      }
                    </p>
                  </div>
                  {notificationPermission !== 'granted' && (
                    <Button onClick={requestNotificationPermission} size="sm">
                      Ativar Notificações
                    </Button>
                  )}
                </div>
              </div>

              {/* Test Notification */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Testar Notificação</h3>
                  <p className="text-sm text-gray-600">Enviar uma notificação de teste</p>
                </div>
                <Button onClick={testNotification} variant="outline" size="sm">
                  Testar
                </Button>
              </div>

              {/* Notification Types */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Tipos de Notificação</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <Label htmlFor="appointments">Agendamentos</Label>
                      <p className="text-sm text-gray-600">Confirmações e lembretes</p>
                    </div>
                  </div>
                  <Switch
                    id="appointments"
                    checked={settings.appointments}
                    onCheckedChange={(checked) => handleSettingChange('appointments', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Gift className="h-5 w-5 text-green-500" />
                    <div>
                      <Label htmlFor="promotions">Promoções</Label>
                      <p className="text-sm text-gray-600">Ofertas e descontos especiais</p>
                    </div>
                  </div>
                  <Switch
                    id="promotions"
                    checked={settings.promotions}
                    onCheckedChange={(checked) => handleSettingChange('promotions', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-orange-500" />
                    <div>
                      <Label htmlFor="reminders">Lembretes</Label>
                      <p className="text-sm text-gray-600">Lembretes de agendamentos</p>
                    </div>
                  </div>
                  <Switch
                    id="reminders"
                    checked={settings.reminders}
                    onCheckedChange={(checked) => handleSettingChange('reminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div>
                      <Label htmlFor="ratings">Avaliações</Label>
                      <p className="text-sm text-gray-600">Solicitações de avaliação</p>
                    </div>
                  </div>
                  <Switch
                    id="ratings"
                    checked={settings.ratings}
                    onCheckedChange={(checked) => handleSettingChange('ratings', checked)}
                  />
                </div>
              </div>

              {/* Sound & Vibration */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Preferências</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound">Som</Label>
                  <Switch
                    id="sound"
                    checked={settings.sound}
                    onCheckedChange={(checked) => handleSettingChange('sound', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="vibration">Vibração</Label>
                  <Switch
                    id="vibration"
                    checked={settings.vibration}
                    onCheckedChange={(checked) => handleSettingChange('vibration', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeTab === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
                  </h3>
                  <p className="text-gray-600">
                    {activeTab === 'unread' 
                      ? 'Todas as suas notificações foram lidas'
                      : 'Você não tem notificações no momento'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-all hover:shadow-md ${
                    !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {notification.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {notification.time}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <Button
                                onClick={() => markAsRead(notification.id)}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              onClick={() => deleteNotification(notification.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
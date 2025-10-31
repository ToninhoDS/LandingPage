import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Download, Smartphone, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWASettings = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const {
    permission,
    isSupported,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification
  } = usePushNotifications();

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone || isInWebAppiOS);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      toast.error('Instalação não disponível no momento');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast.success('App instalado com sucesso!');
        setIsInstalled(true);
      } else {
        toast.info('Instalação cancelada');
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error installing app:', error);
      toast.error('Erro ao instalar o app');
    }
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const permissionGranted = await requestPermission();
      if (permissionGranted) {
        const subscribed = await subscribe();
        if (subscribed) {
          toast.success('Notificações ativadas!');
        } else {
          toast.error('Erro ao ativar notificações');
        }
      } else {
        toast.error('Permissão de notificação negada');
      }
    } else {
      const unsubscribed = await unsubscribe();
      if (unsubscribed) {
        toast.success('Notificações desativadas');
      } else {
        toast.error('Erro ao desativar notificações');
      }
    }
  };

  const handleTestNotification = () => {
    sendTestNotification();
    toast.success('Notificação de teste enviada!');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Configurações do App</h2>
        <p className="text-gray-400">Gerencie as funcionalidades do PWA</p>
      </div>

      {/* Connection Status */}
      <Card className="bg-gray-800/50 border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-400" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-400" />
            )}
            <div>
              <h3 className="text-white font-semibold">Status da Conexão</h3>
              <p className="text-gray-400 text-sm">
                {isOnline ? 'Conectado à internet' : 'Modo offline ativo'}
              </p>
            </div>
          </div>
          <Badge variant={isOnline ? 'default' : 'destructive'}>
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>
      </Card>

      {/* App Installation */}
      <Card className="bg-gray-800/50 border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-blue-400" />
            <div>
              <h3 className="text-white font-semibold">Instalação do App</h3>
              <p className="text-gray-400 text-sm">
                {isInstalled 
                  ? 'App já está instalado no dispositivo' 
                  : 'Instale o app na tela inicial'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={isInstalled ? 'default' : 'secondary'}>
              {isInstalled ? 'Instalado' : 'Não instalado'}
            </Badge>
            {!isInstalled && deferredPrompt && (
              <Button onClick={handleInstallApp} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Instalar
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Push Notifications */}
      <Card className="bg-gray-800/50 border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isSubscribed ? (
              <Bell className="h-5 w-5 text-green-400" />
            ) : (
              <BellOff className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <h3 className="text-white font-semibold">Notificações Push</h3>
              <p className="text-gray-400 text-sm">
                {!isSupported 
                  ? 'Não suportado neste dispositivo'
                  : isSubscribed 
                    ? 'Receba lembretes de agendamentos'
                    : 'Ative para receber notificações'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={isSubscribed ? 'default' : 'secondary'}>
              {permission === 'granted' ? 'Permitido' : 
               permission === 'denied' ? 'Negado' : 'Pendente'}
            </Badge>
            {isSupported && (
              <Switch
                checked={isSubscribed}
                onCheckedChange={handleNotificationToggle}
                disabled={permission === 'denied'}
              />
            )}
          </div>
        </div>
        
        {isSubscribed && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <Button 
              onClick={handleTestNotification}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Enviar Notificação de Teste
            </Button>
          </div>
        )}
      </Card>

      {/* PWA Features Info */}
      <Card className="bg-gray-800/50 border-gray-700 p-6">
        <h3 className="text-white font-semibold mb-4">Recursos do PWA</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Funciona offline</span>
            <Badge variant="default">✓ Ativo</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Cache inteligente</span>
            <Badge variant="default">✓ Ativo</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Sincronização em background</span>
            <Badge variant="default">✓ Ativo</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Instalação nativa</span>
            <Badge variant={deferredPrompt ? 'default' : 'secondary'}>
              {deferredPrompt ? '✓ Disponível' : '- Indisponível'}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PWASettings;
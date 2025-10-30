import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface PWAInstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone || isInWebAppiOS);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as PWAInstallPrompt);
      setIsInstallable(true);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
      toast.success('App instalado com sucesso!');
    };

    // Listen for online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Conexão restaurada');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('Você está offline. Algumas funcionalidades podem estar limitadas.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setInstallPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Error installing app:', error);
      toast.error('Erro ao instalar o aplicativo');
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Este navegador não suporta notificações');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        toast.success('Notificações ativadas!');
        
        // Subscribe to push notifications
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9LdNnC_NNNNNNNNNNNNNNNNNNNNNNNN' // Replace with your VAPID public key
            )
          });
          
          // Send subscription to server
          console.log('Push subscription:', subscription);
        }
        
        return true;
      } else {
        toast.error('Permissão para notificações negada');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Erro ao solicitar permissão para notificações');
      return false;
    }
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (notificationPermission === 'granted') {
      new Notification(title, {
        icon: '/icons/icon-192x192.svg',
        badge: '/icons/icon-72x72.svg',
        ...options
      });
    }
  };

  const shareContent = async (data: ShareData) => {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('Error sharing:', error);
        return false;
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(data.url || data.text || '');
          toast.success('Link copiado para a área de transferência');
          return true;
        } catch (error) {
          console.error('Error copying to clipboard:', error);
          return false;
        }
      }
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    notificationPermission,
    installApp,
    requestNotificationPermission,
    showNotification,
    shareContent
  };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
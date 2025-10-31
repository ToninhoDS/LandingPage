import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { serviceWorkerManager } from '../utils/serviceWorker';

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
  const [swVersion, setSwVersion] = useState<string | null>(null);
  const [cacheSize, setCacheSize] = useState<number>(0);

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

    // Register service worker with advanced features
    const initServiceWorker = async () => {
      try {
        const registration = await serviceWorkerManager.register('/sw.js');
        if (registration) {
          console.log('Advanced Service Worker registered:', registration);
          
          // Get service worker version
          const version = await serviceWorkerManager.getVersion();
          setSwVersion(version);
          
          // Get cache size
          const size = await serviceWorkerManager.getCacheSize();
          setCacheSize(size);
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    initServiceWorker();

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
    try {
      const permission = await serviceWorkerManager.requestNotificationPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        toast.success('Notificações ativadas!');
        
        // Subscribe to push notifications with VAPID key
        const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9LdNnC_NNNNNNNNNNNNNNNNNNNNNNNN'; // Replace with your VAPID public key
        const subscription = await serviceWorkerManager.subscribeToPush(vapidPublicKey);
        
        if (subscription) {
          console.log('Push subscription created:', subscription);
          // Send subscription to server here
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

  const showNotification = async (title: string, options?: NotificationOptions) => {
    try {
      await serviceWorkerManager.showNotification(title, options);
    } catch (error) {
      console.error('Error showing notification:', error);
      toast.error('Erro ao exibir notificação');
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

  const clearCaches = async () => {
    try {
      const success = await serviceWorkerManager.clearCaches();
      if (success) {
        toast.success('Cache limpo com sucesso');
        setCacheSize(0);
      } else {
        toast.error('Erro ao limpar cache');
      }
    } catch (error) {
      console.error('Error clearing caches:', error);
      toast.error('Erro ao limpar cache');
    }
  };

  const updateApp = async () => {
    try {
      await serviceWorkerManager.update();
      toast.success('Aplicativo atualizado');
    } catch (error) {
      console.error('Error updating app:', error);
      toast.error('Erro ao atualizar aplicativo');
    }
  };

  const registerBackgroundSync = async (tag: string) => {
    try {
      await serviceWorkerManager.registerBackgroundSync(tag);
      console.log(`Background sync registered: ${tag}`);
    } catch (error) {
      console.error('Error registering background sync:', error);
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    notificationPermission,
    swVersion,
    cacheSize,
    installApp,
    requestNotificationPermission,
    showNotification,
    shareContent,
    clearCaches,
    updateApp,
    registerBackgroundSync,
    isStandalone: serviceWorkerManager.isStandalone(),
    networkStatus: serviceWorkerManager.getNetworkStatus()
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
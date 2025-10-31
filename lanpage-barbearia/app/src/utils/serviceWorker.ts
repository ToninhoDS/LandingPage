// Service Worker Utility Functions
export interface ServiceWorkerConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onOffline?: () => void;
  onOnline?: () => void;
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private config: ServiceWorkerConfig = {};

  constructor(config: ServiceWorkerConfig = {}) {
    this.config = config;
    this.setupEventListeners();
  }

  // Register service worker
  async register(swUrl: string = '/sw.js'): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register(swUrl);
      this.registration = registration;

      console.log('SW registered: ', registration);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content is available
                console.log('New content is available; please refresh.');
                this.config.onUpdate?.(registration);
              } else {
                // Content is cached for offline use
                console.log('Content is cached for offline use.');
                this.config.onSuccess?.(registration);
              }
            }
          });
        }
      });

      return registration;
    } catch (error) {
      console.error('SW registration failed: ', error);
      return null;
    }
  }

  // Unregister service worker
  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const result = await this.registration.unregister();
      console.log('SW unregistered: ', result);
      return result;
    } catch (error) {
      console.error('SW unregistration failed: ', error);
      return false;
    }
  }

  // Update service worker
  async update(): Promise<void> {
    if (!this.registration) {
      console.warn('No service worker registration found');
      return;
    }

    try {
      await this.registration.update();
      console.log('SW update triggered');
    } catch (error) {
      console.error('SW update failed: ', error);
    }
  }

  // Skip waiting and activate new service worker
  skipWaiting(): void {
    if (!this.registration?.waiting) {
      return;
    }

    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  // Get service worker version
  async getVersion(): Promise<string | null> {
    if (!navigator.serviceWorker.controller) {
      return null;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.version || null);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_VERSION' },
        [messageChannel.port2]
      );
    });
  }

  // Clear all caches
  async clearCaches(): Promise<boolean> {
    if (!navigator.serviceWorker.controller) {
      return false;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success || false);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    });
  }

  // Register background sync
  async registerBackgroundSync(tag: string): Promise<void> {
    if (!this.registration) {
      throw new Error('Service worker not registered');
    }

    if ('sync' in this.registration) {
      try {
        await (this.registration as any).sync.register(tag);
        console.log(`Background sync registered: ${tag}`);
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    } else {
      console.warn('Background sync not supported');
    }
  }

  // Check if app is running in standalone mode (PWA)
  isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  // Check if app can be installed
  canInstall(): boolean {
    return 'beforeinstallprompt' in window;
  }

  // Setup event listeners for online/offline status
  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      console.log('App is online');
      this.config.onOnline?.();
    });

    window.addEventListener('offline', () => {
      console.log('App is offline');
      this.config.onOffline?.();
    });

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Message from SW:', event.data);
      });
    }
  }

  // Get network status
  getNetworkStatus(): {
    online: boolean;
    connection?: NetworkInformation;
  } {
    return {
      online: navigator.onLine,
      connection: (navigator as any).connection
    };
  }

  // Cache management utilities
  async getCacheNames(): Promise<string[]> {
    if (!('caches' in window)) {
      return [];
    }

    try {
      return await caches.keys();
    } catch (error) {
      console.error('Failed to get cache names:', error);
      return [];
    }
  }

  async getCacheSize(): Promise<number> {
    if (!('caches' in window) || !('storage' in navigator)) {
      return 0;
    }

    try {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    } catch (error) {
      console.error('Failed to get cache size:', error);
      return 0;
    }
  }

  // Get performance metrics from service worker
  async getPerformanceMetrics(): Promise<any> {
    if (!navigator.serviceWorker.controller) {
      return null;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.metrics || null);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_PERFORMANCE_METRICS' },
        [messageChannel.port2]
      );
    });
  }

  // Reset performance metrics
  async resetPerformanceMetrics(): Promise<boolean> {
    if (!navigator.serviceWorker.controller) {
      return false;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success || false);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'RESET_PERFORMANCE_METRICS' },
        [messageChannel.port2]
      );
    });
  }

  // Store data for background sync
  async storeForSync(data: any): Promise<boolean> {
    if (!navigator.serviceWorker.controller) {
      return false;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success || false);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'SYNC_DATA', payload: data },
        [messageChannel.port2]
      );
    });
  }

  // Enhanced background sync registration with specific types
  async registerSpecificSync(type: 'appointment' | 'payment' | 'feedback'): Promise<void> {
    if (!this.registration) {
      throw new Error('Service worker not registered');
    }

    if ('sync' in this.registration) {
      try {
        await (this.registration as any).sync.register(`${type}-sync`);
        console.log(`Background sync registered: ${type}-sync`);
      } catch (error) {
        console.error(`Background sync registration failed for ${type}:`, error);
      }
    } else {
      console.warn('Background sync not supported');
    }
  }

  // Monitor network quality
  getNetworkQuality(): {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  } {
    const connection = (navigator as any).connection;
    if (!connection) {
      return {};
    }

    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }

  // Notification utilities
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  }

  async showNotification(title: string, options: NotificationOptions = {}): Promise<void> {
    if (!this.registration) {
      throw new Error('Service worker not registered');
    }

    const permission = await this.requestNotificationPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    try {
      await this.registration.showNotification(title, {
        icon: '/icons/icon-192x192.svg',
        badge: '/icons/icon-72x72.svg',
        vibrate: [100, 50, 100],
        ...options
      });
    } catch (error) {
      console.error('Failed to show notification:', error);
      throw error;
    }
  }

  // Push subscription management
  async subscribeToPush(vapidPublicKey: string): Promise<PushSubscription | null> {
    if (!this.registration) {
      throw new Error('Service worker not registered');
    }

    if (!('PushManager' in window)) {
      console.warn('Push messaging not supported');
      return null;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      });

      console.log('Push subscription created:', subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
      return null;
    }
  }

  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        const result = await subscription.unsubscribe();
        console.log('Push subscription removed:', result);
        return result;
      }
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from push:', error);
      return false;
    }
  }

  // Utility function to convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
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
}

// Create singleton instance
export const serviceWorkerManager = new ServiceWorkerManager();

// Convenience functions
export const registerSW = (config?: ServiceWorkerConfig) => {
  const manager = new ServiceWorkerManager(config);
  return manager.register();
};

export const unregisterSW = () => serviceWorkerManager.unregister();

export const updateSW = () => serviceWorkerManager.update();

export const skipWaiting = () => serviceWorkerManager.skipWaiting();

export const clearCaches = () => serviceWorkerManager.clearCaches();

export const isStandalone = () => serviceWorkerManager.isStandalone();

export const getNetworkStatus = () => serviceWorkerManager.getNetworkStatus();

export const requestNotificationPermission = () => 
  serviceWorkerManager.requestNotificationPermission();

export const showNotification = (title: string, options?: NotificationOptions) =>
  serviceWorkerManager.showNotification(title, options);

// Default export
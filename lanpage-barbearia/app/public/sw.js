// Advanced Service Worker with Cache Strategies
const CACHE_VERSION = '3.0.0';
const STATIC_CACHE = `barbearia-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `barbearia-dynamic-v${CACHE_VERSION}`;
const API_CACHE = `barbearia-api-v${CACHE_VERSION}`;
const IMAGE_CACHE = `barbearia-images-v${CACHE_VERSION}`;
const PERFORMANCE_CACHE = `barbearia-performance-v${CACHE_VERSION}`;

// Performance monitoring
const PERFORMANCE_METRICS = {
  cacheHits: 0,
  cacheMisses: 0,
  networkRequests: 0,
  networkFailures: 0,
  averageResponseTime: 0,
  totalResponseTime: 0,
  requestCount: 0
};

// Cache strategies configuration
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
  '/icons/icon-72x72.svg',
  '/offline.html'
];

// Route patterns and their cache strategies
const ROUTE_CACHE_STRATEGIES = [
  {
    pattern: /^https:\/\/fonts\.googleapis\.com/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cache: STATIC_CACHE,
    maxAge: 60 * 60 * 24 * 365 // 1 year
  },
  {
    pattern: /^https:\/\/fonts\.gstatic\.com/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: STATIC_CACHE,
    maxAge: 60 * 60 * 24 * 365 // 1 year
  },
  {
    pattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: IMAGE_CACHE,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    maxEntries: 100
  },
  {
    pattern: /\/api\/agendamentos/,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cache: API_CACHE,
    maxAge: 60 * 5, // 5 minutes
    networkTimeoutSeconds: 3
  },
  {
    pattern: /\/api\/servicos/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cache: API_CACHE,
    maxAge: 60 * 60 * 24 // 24 hours
  },
  {
    pattern: /\/api\/barbeiros/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cache: API_CACHE,
    maxAge: 60 * 60 * 12 // 12 hours
  },
  {
    pattern: /\.(?:js|css)$/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cache: STATIC_CACHE,
    maxAge: 60 * 60 * 24 * 7 // 7 days
  }
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.includes('barbearia-') && 
                !cacheName.includes(CACHE_VERSION)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - implement cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Find matching cache strategy
  const routeConfig = ROUTE_CACHE_STRATEGIES.find(config => 
    config.pattern.test(request.url)
  );

  if (routeConfig) {
    event.respondWith(handleRequest(request, routeConfig));
  } else {
    // Default strategy for unmatched routes
    event.respondWith(handleRequest(request, {
      strategy: CACHE_STRATEGIES.NETWORK_FIRST,
      cache: DYNAMIC_CACHE,
      maxAge: 60 * 60, // 1 hour
      networkTimeoutSeconds: 5
    }));
  }
});

// Handle requests based on cache strategy
async function handleRequest(request, config) {
  const { strategy, cache: cacheName, maxAge, networkTimeoutSeconds, maxEntries } = config;
  const startTime = performance.now();

  try {
    let response;
    switch (strategy) {
      case CACHE_STRATEGIES.CACHE_FIRST:
        response = await cacheFirst(request, cacheName, maxAge);
        break;
      
      case CACHE_STRATEGIES.NETWORK_FIRST:
        response = await networkFirst(request, cacheName, maxAge, networkTimeoutSeconds);
        break;
      
      case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
        response = await staleWhileRevalidate(request, cacheName, maxAge);
        break;
      
      case CACHE_STRATEGIES.NETWORK_ONLY:
        response = await fetch(request);
        PERFORMANCE_METRICS.networkRequests++;
        break;
      
      case CACHE_STRATEGIES.CACHE_ONLY:
        response = await cacheOnly(request, cacheName);
        break;
      
      default:
        response = await networkFirst(request, cacheName, maxAge, networkTimeoutSeconds);
        break;
    }

    // Update performance metrics
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    updatePerformanceMetrics(responseTime, true);

    return response;
  } catch (error) {
    console.error('[SW] Request failed:', error);
    PERFORMANCE_METRICS.networkFailures++;
    updatePerformanceMetrics(performance.now() - startTime, false);
    return await handleOffline(request);
  }
}

// Performance monitoring functions
function updatePerformanceMetrics(responseTime, success) {
  PERFORMANCE_METRICS.requestCount++;
  PERFORMANCE_METRICS.totalResponseTime += responseTime;
  PERFORMANCE_METRICS.averageResponseTime = PERFORMANCE_METRICS.totalResponseTime / PERFORMANCE_METRICS.requestCount;
  
  if (success) {
    PERFORMANCE_METRICS.cacheHits++;
  } else {
    PERFORMANCE_METRICS.cacheMisses++;
  }
}

function getPerformanceMetrics() {
  return {
    ...PERFORMANCE_METRICS,
    cacheHitRatio: PERFORMANCE_METRICS.requestCount > 0 ? 
      (PERFORMANCE_METRICS.cacheHits / PERFORMANCE_METRICS.requestCount) * 100 : 0,
    networkFailureRate: PERFORMANCE_METRICS.networkRequests > 0 ? 
      (PERFORMANCE_METRICS.networkFailures / PERFORMANCE_METRICS.networkRequests) * 100 : 0
  };
}

// Cache First Strategy
async function cacheFirst(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
    PERFORMANCE_METRICS.cacheHits++;
    return cachedResponse;
  }

  try {
    PERFORMANCE_METRICS.networkRequests++;
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    PERFORMANCE_METRICS.networkFailures++;
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Network First Strategy
async function networkFirst(request, cacheName, maxAge, timeoutSeconds = 5) {
  const cache = await caches.open(cacheName);

  try {
    PERFORMANCE_METRICS.networkRequests++;
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), timeoutSeconds * 1000)
      )
    ]);

    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    PERFORMANCE_METRICS.networkFailures++;
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      PERFORMANCE_METRICS.cacheHits++;
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Always try to fetch from network in background
  const networkResponsePromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Ignore network errors in background
  });

  // Return cached response immediately if available
  if (cachedResponse) {
    // Don't await the network request
    networkResponsePromise;
    return cachedResponse;
  }

  // If no cache, wait for network
  return await networkResponsePromise;
}

// Cache Only Strategy
async function cacheOnly(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  throw new Error('No cached response available');
}

// Check if cached response is expired
function isExpired(response, maxAge) {
  if (!maxAge) return false;
  
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  
  const date = new Date(dateHeader);
  const now = new Date();
  const age = (now.getTime() - date.getTime()) / 1000;
  
  return age > maxAge;
}

// Handle offline scenarios
async function handleOffline(request) {
  const url = new URL(request.url);
  
  // For navigation requests, return offline page
  if (request.mode === 'navigate') {
    const cache = await caches.open(STATIC_CACHE);
    return await cache.match('/offline.html') || new Response('Offline', { status: 503 });
  }
  
  // For API requests, return cached data or error
  if (url.pathname.startsWith('/api/')) {
    const cache = await caches.open(API_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response(JSON.stringify({ 
      error: 'Offline', 
      message: 'Dados não disponíveis offline' 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  throw new Error('Offline and no cached response');
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let notificationData = {
    title: 'Barbearia App',
    body: 'Nova notificação',
    icon: '/icons/icon-192x192.svg',
    badge: '/icons/icon-72x72.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: Math.random()
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir App',
        icon: '/icons/icon-192x192.svg'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/icon-192x192.svg'
      }
    ],
    requireInteraction: true,
    tag: 'barbearia-notification'
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      notificationData = { ...notificationData, ...payload };
    } catch (error) {
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Open or focus the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          const urlToOpen = event.notification.data?.url || '/';
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  switch (event.tag) {
    case 'background-sync':
      event.waitUntil(doBackgroundSync());
      break;
    case 'appointment-sync':
      event.waitUntil(syncAppointments());
      break;
    case 'payment-sync':
      event.waitUntil(syncPayments());
      break;
    case 'feedback-sync':
      event.waitUntil(syncFeedback());
      break;
    case 'agendamentos-sync':
      event.waitUntil(syncAgendamentos());
      break;
    case 'offline-actions':
      event.waitUntil(syncOfflineActions());
      break;
    default:
      event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('[SW] Performing background sync...');
  
  try {
    const pendingData = await getPendingSyncData();
    
    for (const data of pendingData) {
      try {
        // Check retry limit
        if (data.retryCount >= 3) {
          console.log('[SW] Max retries reached for:', data.id);
          await removePendingSyncData(data.id);
          continue;
        }

        // Attempt to sync data
        const response = await fetch(data.url, {
          method: data.method || 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...data.headers
          },
          body: JSON.stringify(data.payload)
        });

        if (response.ok) {
          await removePendingSyncData(data.id);
          console.log('[SW] Sync successful for:', data.id);
          
          // Notify clients of successful sync
          await notifyClients({
            type: 'SYNC_SUCCESS',
            data: { id: data.id, type: data.type }
          });
        } else {
          console.error('[SW] Sync failed for:', data.id, response.status);
          await updateSyncDataRetryCount(data.id, data.retryCount + 1);
        }
      } catch (error) {
        console.error('[SW] Sync error for:', data.id, error);
        await updateSyncDataRetryCount(data.id, data.retryCount + 1);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

async function syncAppointments() {
  console.log('[SW] Syncing appointments...');
  const pendingData = await getPendingSyncData();
  const appointmentData = pendingData.filter(data => data.type === 'appointment');
  
  for (const data of appointmentData) {
    try {
      const response = await fetch('/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.payload)
      });
      
      if (response.ok) {
        await removePendingSyncData(data.id);
        await notifyClients({
          type: 'APPOINTMENT_SYNCED',
          data: data.payload
        });
      }
    } catch (error) {
      console.error('[SW] Appointment sync error:', error);
    }
  }
}

async function syncPayments() {
  console.log('[SW] Syncing payments...');
  const pendingData = await getPendingSyncData();
  const paymentData = pendingData.filter(data => data.type === 'payment');
  
  for (const data of paymentData) {
    try {
      const response = await fetch('/api/pagamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.payload)
      });
      
      if (response.ok) {
        await removePendingSyncData(data.id);
        await notifyClients({
          type: 'PAYMENT_SYNCED',
          data: data.payload
        });
      }
    } catch (error) {
      console.error('[SW] Payment sync error:', error);
    }
  }
}

async function syncFeedback() {
  console.log('[SW] Syncing feedback...');
  const pendingData = await getPendingSyncData();
  const feedbackData = pendingData.filter(data => data.type === 'feedback');
  
  for (const data of feedbackData) {
    try {
      const response = await fetch('/api/avaliacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.payload)
      });
      
      if (response.ok) {
        await removePendingSyncData(data.id);
        await notifyClients({
          type: 'FEEDBACK_SYNCED',
          data: data.payload
        });
      }
    } catch (error) {
      console.error('[SW] Feedback sync error:', error);
    }
  }
}

async function notifyClients(message) {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage(message);
  });
}

// Sync appointments when back online
async function syncAgendamentos() {
  try {
    console.log('[SW] Syncing appointments...');
    
    // Get pending sync data from IndexedDB or localStorage
    const pendingSync = await getPendingSyncData();
    
    if (pendingSync.length > 0) {
      for (const item of pendingSync) {
        try {
          await fetch('/api/agendamentos/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
          
          // Remove from pending sync
          await removePendingSyncData(item.id);
        } catch (error) {
          console.error('[SW] Failed to sync item:', error);
        }
      }
    }
    
    console.log('[SW] Appointments sync completed');
  } catch (error) {
    console.error('[SW] Appointments sync failed:', error);
    throw error;
  }
}

// Sync offline actions
async function syncOfflineActions() {
  try {
    console.log('[SW] Syncing offline actions...');
    
    // Implementation for syncing offline actions
    // This would sync any actions performed while offline
    
    console.log('[SW] Offline actions sync completed');
  } catch (error) {
    console.error('[SW] Offline actions sync failed:', error);
    throw error;
  }
}

// Enhanced IndexedDB for sync data management
const DB_NAME = 'BarbeariaSync';
const DB_VERSION = 1;
const SYNC_STORE = 'pendingSync';

async function openSyncDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(SYNC_STORE)) {
        const store = db.createObjectStore(SYNC_STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

async function storePendingSyncData(data) {
  try {
    const db = await openSyncDB();
    const transaction = db.transaction([SYNC_STORE], 'readwrite');
    const store = transaction.objectStore(SYNC_STORE);
    
    const syncData = {
      ...data,
      timestamp: Date.now(),
      retryCount: 0
    };
    
    await store.add(syncData);
    console.log('[SW] Sync data stored:', syncData);
  } catch (error) {
    console.error('[SW] Error storing sync data:', error);
  }
}

async function getPendingSyncData() {
  try {
    const db = await openSyncDB();
    const transaction = db.transaction([SYNC_STORE], 'readonly');
    const store = transaction.objectStore(SYNC_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[SW] Error getting sync data:', error);
    return [];
  }
}

async function removePendingSyncData(id) {
  try {
    const db = await openSyncDB();
    const transaction = db.transaction([SYNC_STORE], 'readwrite');
    const store = transaction.objectStore(SYNC_STORE);
    
    await store.delete(id);
    console.log('[SW] Sync data removed:', id);
  } catch (error) {
    console.error('[SW] Error removing sync data:', error);
  }
}

async function updateSyncDataRetryCount(id, retryCount) {
  try {
    const db = await openSyncDB();
    const transaction = db.transaction([SYNC_STORE], 'readwrite');
    const store = transaction.objectStore(SYNC_STORE);
    
    const request = store.get(id);
    request.onsuccess = () => {
      const data = request.result;
      if (data) {
        data.retryCount = retryCount;
        data.lastRetry = Date.now();
        store.put(data);
      }
    };
  } catch (error) {
    console.error('[SW] Error updating retry count:', error);
  }
}

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  const { type, payload } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_VERSION });
      break;
    
    case 'GET_PERFORMANCE_METRICS':
      event.ports[0].postMessage({ metrics: getPerformanceMetrics() });
      break;
    
    case 'RESET_PERFORMANCE_METRICS':
      Object.keys(PERFORMANCE_METRICS).forEach(key => {
        PERFORMANCE_METRICS[key] = 0;
      });
      event.ports[0].postMessage({ success: true });
      break;
    
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      }).catch(() => {
        event.ports[0].postMessage({ success: false });
      });
      break;
    
    case 'CACHE_URLS':
      if (payload && payload.urls) {
        cacheUrls(payload.urls).then(() => {
          event.ports[0].postMessage({ success: true });
        }).catch(() => {
          event.ports[0].postMessage({ success: false });
        });
      }
      break;

    case 'SYNC_DATA':
      if (payload) {
        storePendingSyncData(payload).then(() => {
          event.ports[0].postMessage({ success: true });
        }).catch(() => {
          event.ports[0].postMessage({ success: false });
        });
      }
      break;

    default:
      console.log('[SW] Unknown message type:', type);
  }
});

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('[SW] All caches cleared');
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

async function syncContent() {
  console.log('[SW] Periodic content sync');
  // Sync content periodically
}

console.log('[SW] Service Worker loaded successfully');
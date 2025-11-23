const CACHE_NAME = 'iab-cache-v1';
const OFFLINE_URL = '/offline.html';

// Core assets to pre-cache
const CORE_ASSETS = [
  '/',
  '/index.html',
  OFFLINE_URL,
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : undefined))
      )
    )
  );
  self.clients.claim();
});

// Cache-first for static assets, network-first for navigations
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  // Handle navigation requests (HTML)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return (
            cached ||
            (await caches.match(OFFLINE_URL)) ||
            new Response('Offline', { status: 503, statusText: 'Offline' })
          );
        })
    );
    return;
  }

  // Static assets: cache-first
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => cached || new Response(null, { status: 404 }));
      })
    );
  }
});
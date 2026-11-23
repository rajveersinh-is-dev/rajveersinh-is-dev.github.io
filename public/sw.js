// Service Worker for Offline-First Mathematical Portfolio
const CACHE_NAME = 'rvp-math-v3.0.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  const isDevHost = Boolean(
    (url.port && url.port !== '80' && url.port !== '443') ||
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.hostname === '[::1]' ||
    url.hostname.endsWith('.local') ||
    url.hostname.startsWith('192.168.') ||
    url.hostname.startsWith('10.') ||
    url.hostname.startsWith('172.')
  );

  if (
    isDevHost ||
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.includes('node_modules') ||
    url.search.includes('t=') ||
    url.search.includes('import')
  ) {
    return;
  }

  // Navigation / document requests: Network-First to guarantee fresh index.html
  const isNavigate = event.request.mode === 'navigate' ||
                     event.request.destination === 'document' ||
                     event.request.headers.get('accept')?.includes('text/html');

  if (isNavigate) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match('./index.html') || caches.match('./'))
    );
    return;
  }

  // Hashed static assets: Cache-First with background revalidation
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      });
    })
  );
});

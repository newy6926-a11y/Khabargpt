// Khabar GPT Progressive Web App Service Worker (v2)
const CACHE_NAME = 'khabar-gpt-cache-v2';
const APP_SHELL = [
  '/',
  '/index.html',
  '/logo.svg',
  '/logo.png',
  '/favicon.ico',
  '/favicon-48x48.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL).catch((err) => {
        console.warn('Pre-caching warning:', err);
      });
    })
  );
  self.skipWaiting();
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
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. Never cache API calls or dynamic server routes
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/ping')) {
    return;
  }

  // 2. HTML Page Navigation (Fixes the blank white screen on cold start / deep links)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Attempt network first with 3.5s timeout for Render cold start
          const networkPromise = fetch(event.request);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Network timeout')), 3500)
          );

          const networkResponse = await Promise.race([networkPromise, timeoutPromise]);
          if (networkResponse && networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((c) => c.put(event.request, cacheCopy)).catch(() => {});
            return networkResponse;
          }
        } catch {
          // Fall through to cache on timeout / failure
        }

        // Fallback to cached index.html so the SPA loads instead of showing a white screen
        const cachedPage = await caches.match(event.request);
        if (cachedPage) return cachedPage;

        const cachedIndex = await caches.match('/index.html');
        if (cachedIndex) return cachedIndex;

        // If nothing in cache, perform direct fetch without timeout
        return fetch(event.request);
      })()
    );
    return;
  }

  // 3. Static Assets (Images, Favicons, Styles, Scripts)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache).catch(() => {});
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

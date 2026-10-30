const CACHE_NAME = 'ippwaru-pwa-v1';
const ASSETS_TO_CACHE = [
  '/PWA/',
  '/PWA/index.html',
  '/PWA/manifest.json',
  '/PWA/icon-192.png',
  '/PWA/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
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
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }).catch(() => {
      // Fallback jika tidak ada koneksi internet
      return caches.match('/PWA/index.html');
    })
  );
});

// ─── SpeechifyPro — Service Worker ───────────────────────────────────────────
const CACHE_NAME    = 'speechify-v2';
const CACHE_OFFLINE = 'speechify-offline-v2';

// Ressources à mettre en cache immédiatement à l'installation
const PRECACHE_URLS = [
  './',
  './index.html',
  // Polices & icônes (CDN) — mis en cache au premier accès
  'https://unpkg.com/lucide@latest/dist/umd/lucide.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js',
];

// ─── INSTALLATION : précache des ressources statiques ───────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // On ignore les erreurs des URLs CDN (réseau peut être absent)
      return Promise.allSettled(
        PRECACHE_URLS.map(url =>
          cache.add(url).catch(() => console.warn('[SW] précache échoué :', url))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ─── ACTIVATION : nettoyer les anciens caches ────────────────────────────────
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== CACHE_OFFLINE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ─── FETCH : stratégie Cache-First avec fallback réseau ─────────────────────
self.addEventListener('fetch', (e) => {
  // Ne pas intercepter les requêtes non-GET
  if (e.request.method !== 'GET') return;

  // Ne pas intercepter les requêtes vers des APIs externes (INSEE, speechSynthesis…)
  const url = new URL(e.request.url);
  const isExternal = url.hostname !== self.location.hostname &&
                     !url.hostname.includes('unpkg.com') &&
                     !url.hostname.includes('cloudflare') &&
                     !url.hostname.includes('fontshare') &&
                     !url.hostname.includes('googleapis') &&
                     !url.hostname.includes('gstatic');
  if (isExternal) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      // Pas en cache → réseau, puis mise en cache
      return fetch(e.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      }).catch(() => {
        // Hors ligne et non caché → page offline basique
        if (e.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// ─── MESSAGE : forcer la mise à jour ─────────────────────────────────────────
self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

// ─── NOTIFICATIONS PUSH ──────────────────────────────────────────────────────
self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') { self.skipWaiting(); return; }
  if (e.data?.type === 'NOTIFY') {
    self.registration.showNotification(e.data.title, {
      body:  e.data.body,
      icon:  e.data.icon  || './icons/icon-192.png',
      badge: e.data.badge || './icons/icon-192.png',
      vibrate: [200, 100, 200],
      data: { url: self.location.origin }
    });
  }
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data?.url || '/'));
});

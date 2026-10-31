const CACHE = 'lectio-v31';

// The app's own files. Fetched fresh (bypassing the browser's HTTP cache) on
// every install so a new version never stores a stale copy of an old one.
const APP_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// Third-party libraries and fonts: versioned URLs, safe to keep cached
const LIBS = [
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap',
];

// Allow main thread to trigger immediate activation
self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

// Install: cache the app shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => Promise.allSettled([
      ...APP_FILES.map(url => cache.add(new Request(url, { cache: 'reload' }))),
      ...LIBS.map(url => cache.add(url)), // skip failures (e.g. Google Fonts may vary)
    ])).then(() => self.skipWaiting())
  );
});

// Activate: clear old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

const isAppPage = req =>
  req.mode === 'navigate' ||
  new URL(req.url).pathname.endsWith('/index.html');

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // The app page: network first when online, so updates show up right away;
  // fall back to the saved copy offline or on a slow connection
  if (url.origin === location.origin && isAppPage(e.request)) {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(e.request, { cache: 'no-cache', signal: controller.signal });
        clearTimeout(timer);
        if (res.ok) cache.put('./index.html', res.clone());
        return res;
      } catch {
        return (await cache.match('./index.html')) || (await cache.match('./')) || Response.error();
      }
    })());
    return;
  }

  // Everything else: cache first, then network (caching library/font files)
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response.ok && (
          url.hostname === 'cdnjs.cloudflare.com' ||
          url.hostname === 'fonts.googleapis.com' ||
          url.hostname === 'fonts.gstatic.com'
        )) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      });
    }).catch(() => caches.match('./index.html'))
  );
});

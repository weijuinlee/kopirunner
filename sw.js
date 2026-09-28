const CACHE_PREFIX = 'kopirunner-shell-';
const CACHE_NAME = `${CACHE_PREFIX}v10`;
const SHELL = ['./', './index.html', './style.css', './app.js', './pwa.js',
  './navigation.js', './manifest.json', './icon-192.png', './icon-512.png'];
const shellURLs = new Set(SHELL.map((path) => new URL(path, self.registration.scope).href));

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)));
});
self.addEventListener('message', (event) => {
  if (event.data?.type === 'ACTIVATE_UPDATE') event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map((key) => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  url.search = '';
  if (event.request.method !== 'GET' || !shellURLs.has(url.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const saved = await cache.match(url.href);
    return saved || fetch(event.request);
  })());
});

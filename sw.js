const CACHE_PREFIX = 'kopirunner-shell-';
const CACHE_NAME = `${CACHE_PREFIX}a5b75b41d291`;
const SHELL = ['./', './index.html', './assets/style.b9d674266bd7.css', './assets/app.257b937d81ad.js', './assets/pwa.15f7c1f13431.js', './assets/navigation.13b012ff185a.js', './manifest.json', './icon-192.png', './icon-512.png'];
const shellURLs = new Set(SHELL.map((path) => new URL(path, self.registration.scope).href));

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL.map((path) => new Request(new URL(path, self.registration.scope), { cache: 'reload' })))));
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
  // Ignore tracking parameters only for HTML entry points, never for assets.
  const rootURL = self.registration.scope;
  if (url.origin + url.pathname === rootURL ||
      url.origin + url.pathname === new URL('./index.html', rootURL).href) url.search = '';
  if (event.request.method !== 'GET' || !shellURLs.has(url.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const saved = await cache.match(url.href);
    return saved || fetch(event.request);
  })());
});

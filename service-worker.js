const C = 'bingo-pwa-v1';
const ASSETS = ['./', './index.html', './manifest.json', './Icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== C).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const r = e.request;
  e.respondWith(
    caches.match(r).then(m => m || fetch(r).then(res => {
      const cp = res.clone();
      if (r.method === 'GET' && res.ok) caches.open(C).then(c => c.put(r, cp));
      return res;
    }).catch(() => caches.match('./')))
  );
});

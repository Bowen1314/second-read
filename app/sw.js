// Offline support. Pre-caches the app's own files; serves fresh copies online and cached ones offline.
// The service worker never receives anything you paste: the page does not message it, and the
// app makes no requests with your input for it to see.
const VERSION = 'second-read-v1';
const FILES = [
  './', './index.html', './styles.css', './icon.svg', './manifest.webmanifest',
  './js/ui.js', './js/analyze.js', './js/rules.js', './js/links.js', './js/psl.js', './js/punycode.js',
  './js/orgs.js', './js/sources.js', './js/samples.js', './data/psl-data.js', './data/confusables-data.js',
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return; // never handle anything else
  // Network first (so updates show up), cached copy when offline.
  e.respondWith(
    fetch(e.request).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || caches.match('./index.html')))
  );
});

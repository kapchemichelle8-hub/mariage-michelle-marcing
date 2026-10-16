const CACHE_NAME = "mariage-michelle-marcing-offline-v1";
const APP_SHELL = ["/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", () => {
  // Laisser le navigateur aller chercher toujours la version la plus fraîche en ligne
});

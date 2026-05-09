// Double Check — Service Worker
// Network-first strategy with offline fallback for navigation.

// Bump this whenever app shell needs to be force-refreshed on installed PWAs.
const CACHE_VERSION = "v3-camera";
const RUNTIME_CACHE = `dc-runtime-${CACHE_VERSION}`;
const PRECACHE = `dc-precache-${CACHE_VERSION}`;

const PRECACHE_URLS = ["/", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {})),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== PRECACHE && k !== RUNTIME_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // Don't intercept Next.js internals, build assets, or API calls — let the
  // browser handle them so deploys take effect immediately.
  if (
    request.url.includes("/_next/") ||
    request.url.includes("/api/") ||
    request.url.includes("hot-update")
  ) {
    return;
  }

  // Navigation: always go to network, fall back to cache only if offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/"))),
    );
    return;
  }

  // Static GETs (images, fonts): network-first too — keeps deploys fresh.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request)),
  );
});

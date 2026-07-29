// NeumorStudio Service Worker
// Versión: 1.0.0

// Subir esta versión SIEMPRE que cambien los iconos o el logotipo. El evento
// `activate` borra toda caché cuyo nombre no coincida, y es lo único que
// garantiza que quien ya visitó la web deje de ver la marca anterior: la
// estrategia de abajo es stale-while-revalidate, así que sin este cambio
// serviría el logo viejo desde caché al menos una visita más.
// v3 (29-07-2026): el símbolo pasa a ser el monograma NS.
const CACHE_NAME = 'neumorstudio-v3'
const OFFLINE_URL = '/'

// Assets a pre-cachear
const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/images/logo-mark.png',
]

// Instalar: pre-cachear assets críticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      // Pre-cachear assets críticos
      await cache.addAll(PRECACHE_ASSETS)
      // Activar inmediatamente
      await self.skipWaiting()
    })()
  )
})

// Activar: limpiar caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Limpiar caches antiguos
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
      // Tomar control de clientes inmediatamente
      await self.clients.claim()
    })()
  )
})

// Fetch: estrategia stale-while-revalidate para assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Solo manejar requests del mismo origen
  if (url.origin !== location.origin) return

  // Ignorar requests de API y _next/webpack
  if (url.pathname.startsWith('/api/') || url.pathname.includes('webpack')) {
    return
  }

  // Para navegación: network-first con fallback a cache
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Intentar red primero
          const networkResponse = await fetch(request)
          // Guardar en cache si es exitoso
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME)
            cache.put(request, networkResponse.clone())
          }
          return networkResponse
        } catch {
          // Fallback a cache
          const cachedResponse = await caches.match(request)
          return cachedResponse || caches.match(OFFLINE_URL)
        }
      })()
    )
    return
  }

  // Para assets estáticos: stale-while-revalidate
  if (
    request.destination === 'image' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    url.pathname.match(/\.(mp4|webm|png|jpg|jpeg|gif|svg|ico|woff2?)$/i)
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME)
        const cachedResponse = await cache.match(request)

        // Revalidar en background
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone())
            }
            return networkResponse
          })
          .catch(() => cachedResponse)

        // Devolver cache inmediatamente si existe, sino esperar red
        return cachedResponse || fetchPromise
      })()
    )
    return
  }
})

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting()
  }
})

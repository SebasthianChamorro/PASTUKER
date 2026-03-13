/* ================================================
   Pastuker — service-worker.js
   ================================================ */

const CACHE_NAME    = 'Pastuker-v1';
const CACHE_STATIC  = 'Pastuker-static-v1';

/* Todos los archivos que se cachean para funcionar OFFLINE */
const ARCHIVOS_CACHE = [
    /* Raíz */
    './',
    './index.html',
    './manifest.json',

    /* Páginas */
    './pages/login.html',
    './pages/register.html',
    './pages/menugeneral.html',
    './pages/juegos.html',
    './pages/ranking.html',
    './pages/profile.html',
    './pages/avatar-selector.html',

    /* CSS */
    './css/index.css',
    './css/login.css',
    './css/register.css',
    './css/menugeneral.css',
    './css/juegos.css',
    './css/ranking.css',
    './css/profile.css',
    './css/avatar-selector.css',

    /* Imágenes sprites */
    './images/sun.png',
    './images/clouds.png',
    './images/clouds_2.png',
    './images/cloud_3.png',
    './images/birds.png',
    './images/mountain.png',
    './images/tree.png',
    './images/tree_2.png',
    './images/tree_3.png',
    './images/bush.png',
    './images/bush_2.png',
    './images/maloca.png',
    './images/maloca_2.png',
    './images/taita_frame1.png',
    './images/taita_frame2.png',
    './images/mama_frame1.png',
    './images/mama_frame2.png',
    './images/fire.png',
    './images/plant.png',
    './images/trophy.png',

    /* Fuentes Google (si hay conexión se actualizan, sino usa caché) */
    'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800&display=swap'
];

/* ── INSTALL: guarda todos los archivos en caché ── */
self.addEventListener('install', event => {
    console.log('[SW] Instalando Pastuker v1...');
    event.waitUntil(
        caches.open(CACHE_STATIC)
            .then(cache => {
                console.log('[SW] Cacheando archivos estáticos...');
                /* addAll falla si UNO falla — usamos Promise.allSettled para
                   no bloquear si alguna imagen opcional no existe aún */
                return Promise.allSettled(
                    ARCHIVOS_CACHE.map(url => cache.add(url).catch(err => {
                        console.warn('[SW] No se pudo cachear:', url, err);
                    }))
                );
            })
            .then(() => {
                console.log('[SW] Instalación completa ✓');
                return self.skipWaiting(); /* Activa el SW inmediatamente */
            })
    );
});

/* ── ACTIVATE: limpia cachés viejas ── */
self.addEventListener('activate', event => {
    console.log('[SW] Activando...');
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_STATIC)
                    .map(key => {
                        console.log('[SW] Eliminando caché antigua:', key);
                        return caches.delete(key);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

/* ── FETCH: estrategia según el tipo de petición ── */
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    /* 1. Peticiones al backend Flask (/api/) → Network-First
          Si falla la red, devuelve respuesta de error offline */
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirst(event.request));
        return;
    }

    /* 2. DiceBear avatars → Network-First con fallback SVG */
    if (url.hostname === 'api.dicebear.com') {
        event.respondWith(
            fetch(event.request)
                .catch(() => new Response(
                    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="40" fill="#2d6b4a"/>
                        <circle cx="40" cy="30" r="14" fill="#d4af37" opacity="0.8"/>
                        <path d="M10 72c0-16.6 13.4-30 30-30s30 13.4 30 30" fill="#d4af37" opacity="0.6"/>
                     </svg>`,
                    { headers: { 'Content-Type': 'image/svg+xml' } }
                ))
        );
        return;
    }

    /* 3. Google Fonts → Cache-First */
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
        event.respondWith(cacheFirst(event.request));
        return;
    }

    /* 4. Todo lo demás (assets locales) → Cache-First */
    event.respondWith(cacheFirst(event.request));
});


/* ── Estrategia Cache-First ── */
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        /* Solo cachea respuestas válidas */
        if (response && response.status === 200) {
            const cache = await caches.open(CACHE_STATIC);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        /* Offline y no hay caché: devuelve página de error */
        return offlineFallback(request);
    }
}

/* ── Estrategia Network-First ── */
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        return response;
    } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        return new Response(
            JSON.stringify({ error: 'Sin conexión. Intenta de nuevo cuando tengas internet.' }),
            { headers: { 'Content-Type': 'application/json' }, status: 503 }
        );
    }
}

/* ── Fallback offline para páginas HTML ── */
function offlineFallback(request) {
    if (request.headers.get('accept')?.includes('text/html')) {
        return caches.match('./index.html');
    }
    return new Response('Sin conexión', { status: 503 });
}

/* ── Escucha mensajes desde la app (ej: forzar actualización) ── */
self.addEventListener('message', event => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
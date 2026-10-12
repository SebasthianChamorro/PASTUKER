/* ================================================
   Pastuker — service-worker.js
   · Pre-caché de TODO lo necesario para jugar sin internet
     (páginas, CSS, JS, sprites, audios y fuentes).
   · cache-first para archivos estáticos.
   · network-first para /api/.
   La lista y la versión las genera tools/generar_precache.py:
   ejecútalo cada vez que agregues o cambies archivos.
   ================================================ */

/* <PRECACHE> — sección generada automáticamente, no editar a mano */
const CACHE_VERSION = '394b1c6dd9';
const ARCHIVOS_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './pages/avatar-selector.html',
    './pages/creditos.html',
    './pages/game-2.html',
    './pages/game.html',
    './pages/inventario.html',
    './pages/juegos.html',
    './pages/login.html',
    './pages/menugeneral.html',
    './pages/privacidad.html',
    './pages/profile.html',
    './pages/ranking-tabla.html',
    './pages/ranking.html',
    './pages/register.html',
    './css/avatar-selector.css',
    './css/dialogos.css',
    './css/game-2.css',
    './css/game.css',
    './css/index.css',
    './css/juegos.css',
    './css/login.css',
    './css/menugeneral.css',
    './css/profile.css',
    './css/ranking.css',
    './css/register.css',
    './js/api.js',
    './js/audio.js',
    './js/avatar-selector.js',
    './js/dialogos.js',
    './js/game-2.js',
    './js/game.js',
    './js/index.js',
    './js/juegos.js',
    './js/login.js',
    './js/menugeneral.js',
    './js/phaser.min.js',
    './js/plantas_catalogo.js',
    './js/profile.js',
    './js/ranking-tabla.js',
    './js/ranking.js',
    './js/register.js',
    './images/landscale/birds.png',
    './images/landscale/bush.png',
    './images/landscale/bush_2.png',
    './images/landscale/cloud_3.png',
    './images/landscale/clouds.png',
    './images/landscale/clouds_2.png',
    './images/landscale/maloca.png',
    './images/landscale/mountain.png',
    './images/landscale/okwute.png',
    './images/landscale/sun.png',
    './images/landscale/tree.png',
    './images/landscale/tree_2.png',
    './images/landscale/tree_3.png',
    './images/taita/taita-caminando1.png',
    './images/taita/taita-caminando2.png',
    './images/taita/taita_frame1.png',
    './images/taita/taita_frame2.png',
    './images/mama/mama_frame1.png',
    './images/mama/mama_frame2.png',
    './images/logos/logo_cabildo.png',
    './images/logos/logo_universidad.png',
    './images/icons/fire.png',
    './images/icons/plant.png',
    './images/icons/sol-pastos.png',
    './images/icons/trophy.png',
    './images/game/icons_game/plant_1.png',
    './images/game/icons_game/plant_2.png',
    './images/game/icons_game/plant_3.png',
    './images/game/icons_game/plant_4.png',
    './images/game/icons_game/plant_5.png',
    './images/game/plants/AJENJO.jpg',
    './images/game/plants/ALTAMISA.jpg',
    './images/game/plants/ARNICA.jpg',
    './images/game/plants/BREVA.jpg',
    './images/game/plants/CALENDULA.jpg',
    './images/game/plants/CIDRON.jpg',
    './images/game/plants/CLAVEL.jpg',
    './images/game/plants/COFREY.jpg',
    './images/game/plants/DIENTE-DE-LEON.jpg',
    './images/game/plants/EUCALIPTO.jpg',
    './images/game/plants/HIERBA-BUENA.jpg',
    './images/game/plants/INSULINA.jpg',
    './images/game/plants/LLANTEN.jpg',
    './images/game/plants/MANZANILLA.jpg',
    './images/game/plants/MENTA.jpg',
    './images/game/plants/MISPERO.jpg',
    './images/game/plants/NABO.jpg',
    './images/game/plants/OREGANO.jpg',
    './images/game/plants/ORTIGA.jpg',
    './images/game/plants/PEPINO-DULCE.jpg',
    './images/game/plants/POLEO.jpg',
    './images/game/plants/ROMERILLO.jpg',
    './images/game/plants/ROMERO.jpg',
    './images/game/plants/RUDA.jpg',
    './images/game/plants/SAVILA.jpg',
    './images/game/plants/SEGUIDORA.jpg',
    './images/game/plants/TOMILLO.jpg',
    './images/game/plants/TORONJIL-GRANDE.jpg',
    './images/game/plants/TORONJIL-PEQUENO.jpg',
    './images/game/plants/VALERIANA.jpg',
    './images/game/portal/portal01.png',
    './images/game/portal/portal02.png',
    './images/game/portal/portal03.png',
    './images/game/portal/portal04.png',
    './images/game/portal/portal05.png',
    './images/game/portal/portal06.png',
    './images/game/portal/portal07.png',
    './images/game/portal/portal08.png',
    './images/game/portal/portal09.png',
    './images/game/portal/portal10.png',
    './images/game/portal/portal11.png',
    './images/game/portal/portal12.png',
    './images/game/portal/portal13.png',
    './images/game/portal/portal14.png',
    './images/game/portal/portal15.png',
    './images/game/walk-bear/walk-bear-arrive1.png',
    './images/game/walk-bear/walk-bear-arrive2.png',
    './images/game/walk-bear/walk-bear-arrive3.png',
    './images/game/walk-bear/walk-bear-default.png',
    './images/game/walk-bear/walk-bear-down1.png',
    './images/game/walk-bear/walk-bear-down2.png',
    './images/game/walk-bear/walk-bear-down3.png',
    './images/game/walk-men/walk-arrive1.png',
    './images/game/walk-men/walk-arrive2.png',
    './images/game/walk-men/walk-arrive3.png',
    './images/game/walk-men/walk-default.png',
    './images/game/walk-men/walk-down1.png',
    './images/game/walk-men/walk-down2.png',
    './images/game/walk-men/walk-down3.png',
    './images/game/walk-men/walk-left1.png',
    './images/game/walk-men/walk-left2.png',
    './images/game/walk-men/walk-left3.png',
    './images/game/walk-men/walk-right1.png',
    './images/game/walk-men/walk-right2.png',
    './images/game/walk-men/walk-right3.png',
    './images/game/walk-woman/walk2-arrive1.png',
    './images/game/walk-woman/walk2-arrive2.png',
    './images/game/walk-woman/walk2-arrive3.png',
    './images/game/walk-woman/walk2-default.png',
    './images/game/walk-woman/walk2-down1.png',
    './images/game/walk-woman/walk2-down2.png',
    './images/game/walk-woman/walk2-down3.png',
    './images/game/walk-woman/walk2-left1.png',
    './images/game/walk-woman/walk2-left2.png',
    './images/game/walk-woman/walk2-left3.png',
    './images/game/walk-woman/walk2-right1.png',
    './images/game/walk-woman/walk2-right2.png',
    './images/game2/crounch-men/crunch-men1.png',
    './images/game2/crounch-men/crunch-men2.png',
    './images/game2/crounch-men/crunch-men3.png',
    './images/game2/crounch-woman/crounch-woman1.png',
    './images/game2/crounch-woman/crounch-woman2.png',
    './images/game2/crounch-woman/crounch-woman3.png',
    './images/game2/crounch-woman/crounch-woman4.png',
    './images/game2/fire_down/fire_down1.png',
    './images/game2/fire_down/fire_down10.png',
    './images/game2/fire_down/fire_down11.png',
    './images/game2/fire_down/fire_down12.png',
    './images/game2/fire_down/fire_down13.png',
    './images/game2/fire_down/fire_down14.png',
    './images/game2/fire_down/fire_down15.png',
    './images/game2/fire_down/fire_down16.png',
    './images/game2/fire_down/fire_down17.png',
    './images/game2/fire_down/fire_down18.png',
    './images/game2/fire_down/fire_down19.png',
    './images/game2/fire_down/fire_down2.png',
    './images/game2/fire_down/fire_down20.png',
    './images/game2/fire_down/fire_down21.png',
    './images/game2/fire_down/fire_down22.png',
    './images/game2/fire_down/fire_down23.png',
    './images/game2/fire_down/fire_down24.png',
    './images/game2/fire_down/fire_down25.png',
    './images/game2/fire_down/fire_down26.png',
    './images/game2/fire_down/fire_down27.png',
    './images/game2/fire_down/fire_down28.png',
    './images/game2/fire_down/fire_down29.png',
    './images/game2/fire_down/fire_down3.png',
    './images/game2/fire_down/fire_down30.png',
    './images/game2/fire_down/fire_down31.png',
    './images/game2/fire_down/fire_down32.png',
    './images/game2/fire_down/fire_down33.png',
    './images/game2/fire_down/fire_down34.png',
    './images/game2/fire_down/fire_down35.png',
    './images/game2/fire_down/fire_down36.png',
    './images/game2/fire_down/fire_down37.png',
    './images/game2/fire_down/fire_down38.png',
    './images/game2/fire_down/fire_down39.png',
    './images/game2/fire_down/fire_down4.png',
    './images/game2/fire_down/fire_down40.png',
    './images/game2/fire_down/fire_down41.png',
    './images/game2/fire_down/fire_down42.png',
    './images/game2/fire_down/fire_down43.png',
    './images/game2/fire_down/fire_down44.png',
    './images/game2/fire_down/fire_down45.png',
    './images/game2/fire_down/fire_down46.png',
    './images/game2/fire_down/fire_down47.png',
    './images/game2/fire_down/fire_down48.png',
    './images/game2/fire_down/fire_down49.png',
    './images/game2/fire_down/fire_down5.png',
    './images/game2/fire_down/fire_down50.png',
    './images/game2/fire_down/fire_down6.png',
    './images/game2/fire_down/fire_down7.png',
    './images/game2/fire_down/fire_down8.png',
    './images/game2/fire_down/fire_down9.png',
    './images/game2/fire_up/fire_up1.png',
    './images/game2/fire_up/fire_up10.png',
    './images/game2/fire_up/fire_up11.png',
    './images/game2/fire_up/fire_up12.png',
    './images/game2/fire_up/fire_up13.png',
    './images/game2/fire_up/fire_up14.png',
    './images/game2/fire_up/fire_up15.png',
    './images/game2/fire_up/fire_up16.png',
    './images/game2/fire_up/fire_up17.png',
    './images/game2/fire_up/fire_up18.png',
    './images/game2/fire_up/fire_up19.png',
    './images/game2/fire_up/fire_up2.png',
    './images/game2/fire_up/fire_up20.png',
    './images/game2/fire_up/fire_up21.png',
    './images/game2/fire_up/fire_up22.png',
    './images/game2/fire_up/fire_up23.png',
    './images/game2/fire_up/fire_up24.png',
    './images/game2/fire_up/fire_up25.png',
    './images/game2/fire_up/fire_up26.png',
    './images/game2/fire_up/fire_up27.png',
    './images/game2/fire_up/fire_up28.png',
    './images/game2/fire_up/fire_up29.png',
    './images/game2/fire_up/fire_up3.png',
    './images/game2/fire_up/fire_up30.png',
    './images/game2/fire_up/fire_up31.png',
    './images/game2/fire_up/fire_up32.png',
    './images/game2/fire_up/fire_up33.png',
    './images/game2/fire_up/fire_up34.png',
    './images/game2/fire_up/fire_up35.png',
    './images/game2/fire_up/fire_up36.png',
    './images/game2/fire_up/fire_up37.png',
    './images/game2/fire_up/fire_up38.png',
    './images/game2/fire_up/fire_up39.png',
    './images/game2/fire_up/fire_up4.png',
    './images/game2/fire_up/fire_up40.png',
    './images/game2/fire_up/fire_up41.png',
    './images/game2/fire_up/fire_up42.png',
    './images/game2/fire_up/fire_up43.png',
    './images/game2/fire_up/fire_up44.png',
    './images/game2/fire_up/fire_up45.png',
    './images/game2/fire_up/fire_up46.png',
    './images/game2/fire_up/fire_up47.png',
    './images/game2/fire_up/fire_up48.png',
    './images/game2/fire_up/fire_up49.png',
    './images/game2/fire_up/fire_up5.png',
    './images/game2/fire_up/fire_up50.png',
    './images/game2/fire_up/fire_up6.png',
    './images/game2/fire_up/fire_up7.png',
    './images/game2/fire_up/fire_up8.png',
    './images/game2/fire_up/fire_up9.png',
    './images/game2/game_set/Diamond_Pixel.png',
    './images/game2/game_set/GEM_Pixel .png',
    './images/game2/game_set/Ruby_Pixel .png',
    './images/game2/jump-men/jump-men1.png',
    './images/game2/jump-men/jump-men2.png',
    './images/game2/jump-men/jump-men3.png',
    './images/game2/jump-men/jump-men4.png',
    './images/game2/jump-men/jump-men5.png',
    './images/game2/jump-men/jump-men6.png',
    './images/game2/jump-men/jump-men7.png',
    './images/game2/jump-men/jump-men8.png',
    './images/game2/jump-men/jump-men9.png',
    './images/game2/jump-men2/jump-men2.1.png',
    './images/game2/jump-men2/jump-men2.2.png',
    './images/game2/jump-men2/jump-men2.3.png',
    './images/game2/jump-men2/jump-men2.4.png',
    './images/game2/jump-men2/jump-men2.5.png',
    './images/game2/jump-men2/jump-men2.6.png',
    './images/game2/jump-men2/jump-men2.7.png',
    './images/game2/jump-men2/jump-men2.8.png',
    './images/game2/jump-men2/jump-men2.9.png',
    './images/game2/jump-woman/jump-woman1.png',
    './images/game2/jump-woman/jump-woman2.png',
    './images/game2/jump-woman/jump-woman3.png',
    './images/game2/jump-woman/jump-woman4.png',
    './images/game2/jump-woman/jump-woman5.png',
    './images/game2/jump-woman/jump-woman6.png',
    './images/game2/jump-woman/jump-woman7.png',
    './images/game2/jump-woman/jump-woman8.png',
    './images/game2/jump-woman/jump-woman9.png',
    './images/game2/jump-woman2/jump-woman2.1.png',
    './images/game2/jump-woman2/jump-woman2.10.png',
    './images/game2/jump-woman2/jump-woman2.2.png',
    './images/game2/jump-woman2/jump-woman2.3.png',
    './images/game2/jump-woman2/jump-woman2.4.png',
    './images/game2/jump-woman2/jump-woman2.5.png',
    './images/game2/jump-woman2/jump-woman2.6.png',
    './images/game2/jump-woman2/jump-woman2.7.png',
    './images/game2/jump-woman2/jump-woman2.8.png',
    './images/game2/jump-woman2/jump-woman2.9.png',
    './images/game2/landscale/bg_jungle.png',
    './images/game2/landscale/jungle_pack_03.png',
    './images/game2/landscale/jungle_pack_05.png',
    './images/game2/landscale/jungle_pack_07.png',
    './images/game2/landscale/jungle_pack_09.png',
    './images/game2/landscale/jungle_pack_11.png',
    './images/game2/landscale/jungle_pack_13.png',
    './images/game2/landscale/jungle_pack_15.png',
    './images/game2/landscale/jungle_pack_17.png',
    './images/game2/landscale/jungle_pack_19.png',
    './images/game2/landscale/jungle_pack_21.png',
    './images/game2/landscale/jungle_pack_33.png',
    './images/game2/landscale/jungle_pack_34.png',
    './images/game2/landscale/jungle_pack_35.png',
    './images/game2/landscale/jungle_pack_36.png',
    './images/game2/landscale/jungle_pack_37.png',
    './images/game2/landscale/jungle_pack_38.png',
    './images/game2/landscale/jungle_pack_39.png',
    './images/game2/landscale/jungle_pack_40.png',
    './images/game2/landscale/jungle_pack_41.png',
    './images/game2/landscale/jungle_pack_52.png',
    './images/game2/landscale/jungle_pack_54.png',
    './images/game2/landscale/jungle_pack_57.png',
    './images/game2/landscale/jungle_pack_59.png',
    './images/game2/landscale/jungle_pack_63.png',
    './images/game2/landscale/jungle_pack_64.png',
    './images/game2/landscale/jungle_pack_65.png',
    './images/game2/landscale/jungle_pack_66.png',
    './images/game2/landscale/jungle_pack_67.png',
    './images/game2/landscale/jungle_pack_68.png',
    './images/game2/rotating-obstacle/rotating_obstacle1.png',
    './images/game2/rotating-obstacle/rotating_obstacle2.png',
    './images/game2/rotating-obstacle/rotating_obstacle3.png',
    './images/game2/rotating-obstacle/rotating_obstacle4.png',
    './images/game2/rotating-obstacle/rotating_obstacle5.png',
    './images/game2/rotating-obstacle/rotating_obstacle6.png',
    './images/game2/rotating-obstacle/rotating_obstacle7.png',
    './images/game2/rotating-obstacle/rotating_obstacle8.png',
    './images/game2/rotating-obstacle2/rotating_obstacle2.1.png',
    './images/game2/rotating-obstacle2/rotating_obstacle2.2.png',
    './images/game2/rotating-obstacle2/rotating_obstacle2.3.png',
    './images/game2/rotating-obstacle2/rotating_obstacle2.4.png',
    './images/game2/rotating-obstacle2/rotating_obstacle2.5.png',
    './images/game2/rotating-obstacle2/rotating_obstacle2.6.png',
    './images/game2/rotating-obstacle2/rotating_obstacle2.7.png',
    './images/game2/rotating-obstacle2/rotating_obstacle2.8.png',
    './images/game2/stakes/stakes.png',
    './images/icon-192.png',
    './images/icon-512.png',
    './audio/dialogos/mama/login_bienvenida.mp3',
    './audio/dialogos/mama/login_cargando.mp3',
    './audio/dialogos/mama/login_error.mp3',
    './audio/dialogos/mama/perfil_avatar_cambiado.mp3',
    './audio/dialogos/mama/perfil_bienvenida.mp3',
    './audio/dialogos/mama/perfil_guardado.mp3',
    './audio/dialogos/mama/register_bienvenida.mp3',
    './audio/dialogos/mama/register_completo.mp3',
    './audio/dialogos/mama/register_genero.mp3',
    './audio/dialogos/taita/index_bienvenida.mp3',
    './audio/dialogos/taita/index_regreso.mp3',
    './audio/dialogos/taita/juego_antes_quiz.mp3',
    './audio/dialogos/taita/juego_inicio.mp3',
    './audio/dialogos/taita/juego_portal.mp3',
    './audio/dialogos/taita/juego_resultado_bajo.mp3',
    './audio/dialogos/taita/juego_resultado_bueno.mp3',
    './audio/dialogos/taita/juego_resultado_regular.mp3',
    './audio/dialogos/taita/juego_taita_con_plantas.mp3',
    './audio/dialogos/taita/juego_taita_sin_plantas.mp3',
    './audio/dialogos/taita/juegos_bienvenida.mp3',
    './audio/dialogos/taita/juegos_mundo1.mp3',
    './audio/dialogos/taita/juegos_mundo2_bloqueado.mp3',
    './audio/dialogos/taita/logro_cinco_plantas.mp3',
    './audio/dialogos/taita/logro_mundo_completo.mp3',
    './audio/dialogos/taita/logro_primera_planta.mp3',
    './audio/dialogos/taita/logro_quiz_perfecto.mp3',
    './audio/dialogos/taita/menu_bienvenida.mp3',
    './audio/dialogos/taita/menu_mundo1_completo.mp3',
    './audio/dialogos/taita/menu_sin_mundos.mp3',
    './audio/dialogos/taita/ranking_bienvenida.mp3',
    './audio/dialogos/taita/ranking_top3.mp3',
    './audio/music/forest_loop.mp3',
    './audio/music/game_over.wav',
    './audio/music/jungle_loop.ogg',
    './audio/music/menu_loop.mp3',
    './audio/sfx/correct_answer.wav',
    './audio/sfx/hurt.ogg',
    './audio/sfx/jump.ogg',
    './audio/sfx/level_complete.wav',
    './audio/sfx/portal.ogg',
    './audio/sfx/recoger_gema.wav',
    './audio/sfx/recoger_planta.wav',
    './audio/sfx/wrong_answer.ogg',
];
/* </PRECACHE> */

const CACHE_STATIC = `Pastuker-static-${CACHE_VERSION}`;
const CACHE_FUENTES = 'Pastuker-fuentes-v1';

const FUENTES = [
    'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800&display=swap',
    'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
];

/* ── INSTALL ── */
self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_STATIC);
        let fallos = 0;
        // De a 8 archivos a la vez para no saturar la conexión del celular
        for (let i = 0; i < ARCHIVOS_CACHE.length; i += 8) {
            const lote = ARCHIVOS_CACHE.slice(i, i + 8);
            const res = await Promise.allSettled(lote.map(url => cache.add(url)));
            res.forEach((r, k) => {
                if (r.status === 'rejected') { fallos++; console.warn('[SW] No se pudo cachear:', lote[k]); }
            });
        }
        const fc = await caches.open(CACHE_FUENTES);
        await Promise.allSettled(FUENTES.map(u => fc.add(new Request(u, { mode: 'cors' }))));
        console.log(`[SW] ${CACHE_STATIC}: ${ARCHIVOS_CACHE.length - fallos}/${ARCHIVOS_CACHE.length} archivos en caché`);
        await self.skipWaiting();
    })());
});

/* ── ACTIVATE: borra cachés de versiones anteriores ── */
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_STATIC && key !== CACHE_FUENTES)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

/* ── FETCH ── */
self.addEventListener('fetch', event => {
    const req = event.request;
    if (req.method !== 'GET') return;            // POST/PUT/DELETE van directo a la red
    const url = new URL(req.url);

    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirst(req));
        return;
    }

    if (url.hostname === 'api.dicebear.com') {
        event.respondWith(avatarConRespaldo(req));
        return;
    }

    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
        event.respondWith(cacheFirst(req, CACHE_FUENTES));
        return;
    }

    if (url.origin === self.location.origin) {
        event.respondWith(cacheFirst(req, CACHE_STATIC));
    }
});

async function cacheFirst(request, nombreCache) {
    const cached = await caches.match(request, { ignoreSearch: request.mode === 'navigate' });
    if (cached) return cached;
    try {
        const response = await fetch(request);
        if (response && (response.status === 200 || response.type === 'opaque')) {
            const cache = await caches.open(nombreCache);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        return offlineFallback(request);
    }
}

async function networkFirst(request) {
    try {
        const response = await fetch(request);
        // Se guarda una copia del ranking para consultarlo sin conexión
        if (response.ok && new URL(request.url).pathname === '/api/ranking') {
            const cache = await caches.open(CACHE_STATIC);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        return new Response(
            JSON.stringify({ ok: false, offline: true, msg: 'Sin conexión. Intenta de nuevo cuando tengas internet.' }),
            { headers: { 'Content-Type': 'application/json' }, status: 503 }
        );
    }
}

async function avatarConRespaldo(request) {
    const cache = await caches.open(CACHE_FUENTES);
    try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
    } catch {
        const cached = await cache.match(request);
        if (cached) return cached;
        return new Response(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="40" fill="#2d6b4a"/>
                <circle cx="40" cy="30" r="14" fill="#d4af37" opacity="0.8"/>
                <path d="M10 72c0-16.6 13.4-30 30-30s30 13.4 30 30" fill="#d4af37" opacity="0.6"/>
            </svg>`,
            { headers: { 'Content-Type': 'image/svg+xml' } }
        );
    }
}

async function offlineFallback(request) {
    if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
        return (await caches.match('./index.html')) || new Response('Sin conexión', { status: 503 });
    }
    return new Response('Sin conexión', { status: 503 });
}

self.addEventListener('message', event => {
    if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

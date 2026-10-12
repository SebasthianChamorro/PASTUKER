/* ════════════════════════════════════════════════════════════════
   PASTUKER — api.js
   Módulo compartido por todas las pantallas:
     · Dirección de la API (automática, sin localhost fijo)
     · Llamadas autenticadas (Authorization: Bearer <token>)
     · Sincronización del progreso local ↔ servidor, con cola sin conexión
     · Hash de contraseña para el inicio de sesión sin conexión (PBKDF2 + sal)
   Debe cargarse ANTES que login.js, register.js, profile.js, etc.
════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    /* ── 1. Dirección de la API ─────────────────────────────────────
       · Si el Frontend lo sirve el propio Flask (recomendado, también en
         producción) → mismo origen → rutas relativas ('').
       · Si se abre con un servidor de desarrollo (Live Server 5500/5501…)
         → mismo host, puerto 5000 (donde corre Flask).
       · Para un dominio distinto, define window.PASTUKER_API_URL antes de
         cargar este archivo, p. ej. 'https://pastuker.up.railway.app'.     */
    const PUERTOS_DEV = ['5500', '5501', '5502', '3000', '5173', '8000', '8080'];
    function detectarApi() {
        if (typeof window.PASTUKER_API_URL === 'string') return window.PASTUKER_API_URL.replace(/\/$/, '');
        const { protocol, hostname, port } = window.location;
        if (protocol === 'file:') return 'http://localhost:5000';
        if (PUERTOS_DEV.includes(port)) return `${protocol}//${hostname}:5000`;
        return '';
    }
    const API_URL = detectarApi();

    /* ── Claves de localStorage que forman el progreso del jugador ── */
    const NIVELES_M2 = 10;
    const CLAVES_PROGRESO = [
        'usuario_xp', 'xp_sincronizada', 'plantas_encontradas', 'mundo1_completo', 'mundo2_completo',
        'partidas', 'puntos_total', 'quiz_aciertos', 'quiz_preguntas', 'sync_pendiente',
        ...Array.from({ length: NIVELES_M2 }, (_, n) => `g2_inv_n${n}`),
        ...Array.from({ length: NIVELES_M2 }, (_, n) => `g2_gems_n${n}`),
    ];

    /* ── localStorage seguro (modo privado, almacenamiento bloqueado…) ── */
    const LS = {
        get(k)       { try { return localStorage.getItem(k); } catch { return null; } },
        set(k, v)    { try { localStorage.setItem(k, String(v)); } catch { /* sin espacio */ } },
        del(k)       { try { localStorage.removeItem(k); } catch { /* nada */ } },
        json(k, def) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? def; } catch { return def; } },
        int(k)       { const n = parseInt(LS.get(k) || '0', 10); return Number.isFinite(n) ? n : 0; },
    };

    const token = () => LS.get('usuario_token');

    /* ── 2. Llamadas a la API ───────────────────────────────────────
       Devuelve { ok, status, data }. Lanza error SOLO si no hay red
       (así cada pantalla decide su comportamiento sin conexión).        */
    async function api(ruta, { method = 'GET', body, auth = true, timeout = 8000, keepalive = false } = {}) {
        const headers = { 'Content-Type': 'application/json' };
        if (auth && token()) headers.Authorization = `Bearer ${token()}`;
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), timeout);
        try {
            const res = await fetch(`${API_URL}${ruta}`, {
                method, headers, keepalive,
                body: body !== undefined ? JSON.stringify(body) : undefined,
                signal: ctrl.signal,
            });
            let data = {};
            try { data = await res.json(); } catch { /* respuesta sin JSON */ }
            // Respuesta 503 del service worker = sin conexión
            if (res.status === 503 && data && data.offline) throw new Error('offline');
            if (res.status === 401 && auth && token()) {
                // Token vencido o revocado: se conserva el progreso local
                LS.del('usuario_token');
            }
            return { ok: res.ok && data.ok !== false, status: res.status, data };
        } finally {
            clearTimeout(t);
        }
    }

    /* ── 3. Hash local para entrar sin conexión ─────────────────────
       PBKDF2-SHA256 con sal aleatoria de 16 bytes y 150.000 iteraciones.
       Formato guardado: pbkdf2$<iteraciones>$<salHex>$<hashHex>
       (Requiere contexto seguro: HTTPS o localhost.)                    */
    const ITER = 150000;
    const hex  = (buf) => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    const unhex = (h) => new Uint8Array((h.match(/../g) || []).map(x => parseInt(x, 16)));
    const cryptoDisponible = () => !!(window.crypto && crypto.subtle);

    async function pbkdf2(password, sal, iter) {
        const clave = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
        const bits  = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: sal, iterations: iter }, clave, 256);
        return hex(bits);
    }

    async function guardarHashOffline(telefono, password) {
        if (!cryptoDisponible()) return;
        const sal = crypto.getRandomValues(new Uint8Array(16));
        const h   = await pbkdf2(password, sal, ITER);
        LS.set('usuario_pwd_hash', `pbkdf2$${ITER}$${hex(sal)}$${h}`);
        LS.set('usuario_pwd_tel', telefono);
    }

    async function verificarOffline(telefono, password) {
        const guardado = LS.get('usuario_pwd_hash') || '';
        const telGuardado = LS.get('usuario_pwd_tel') || LS.get('usuario_telefono');
        if (!guardado || telGuardado !== telefono || !cryptoDisponible()) return false;
        if (guardado.startsWith('pbkdf2$')) {
            const [, iter, sal, h] = guardado.split('$');
            return (await pbkdf2(password, unhex(sal), parseInt(iter, 10))) === h;
        }
        // Formato antiguo (SHA-256 sin sal): se acepta una vez y se migra
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
        if (hex(buf) === guardado) { await guardarHashOffline(telefono, password); return true; }
        return false;
    }

    /* ── 4. Progreso: leer, fusionar, enviar ─────────────────────── */
    function leerProgresoLocal() {
        const gemas = {};
        for (let n = 0; n < NIVELES_M2; n++) {
            const inv = LS.json(`g2_inv_n${n}`, []);
            if (Array.isArray(inv) && inv.length) gemas[n] = inv;
        }
        return {
            xp: LS.int('usuario_xp'),
            plantas_encontradas: LS.json('plantas_encontradas', []),
            mundo1_completo: !!LS.get('mundo1_completo'),
            mundo2_completo: !!LS.get('mundo2_completo'),
            partidas:  LS.int('partidas'),
            aciertos:  LS.int('quiz_aciertos'),
            preguntas: LS.int('quiz_preguntas'),
            gemas,
        };
    }

    /* Une el progreso que viene del servidor con el local (nunca se pierde nada). */
    function fusionarProgreso(p) {
        if (!p) return;
        const xpLocal = LS.int('usuario_xp');
        const xp = Math.max(xpLocal, p.xp || 0);
        LS.set('usuario_xp', xp);

        const plantas = new Set([...LS.json('plantas_encontradas', []), ...(p.plantas_encontradas || [])]);
        LS.set('plantas_encontradas', JSON.stringify([...plantas]));

        if (p.mundo1_completo) LS.set('mundo1_completo', '1');
        if (p.mundo2_completo) LS.set('mundo2_completo', '1');

        LS.set('partidas',       Math.max(LS.int('partidas'),       p.partidas  || 0));
        LS.set('quiz_aciertos',  Math.max(LS.int('quiz_aciertos'),  p.aciertos  || 0));
        LS.set('quiz_preguntas', Math.max(LS.int('quiz_preguntas'), p.preguntas || 0));

        Object.entries(p.gemas || {}).forEach(([n, lista]) => {
            const inv = new Set([...LS.json(`g2_inv_n${n}`, []), ...lista]);
            LS.set(`g2_inv_n${n}`, JSON.stringify([...inv]));
        });
    }

    let syncEnCurso = null;
    let syncTimer   = null;

    /* Envía el progreso al servidor. Si no hay red o sesión, queda pendiente. */
    async function sincronizar({ keepalive = false } = {}) {
        if (!token()) { LS.set('sync_pendiente', '1'); return { ok: false, motivo: 'sin_sesion' }; }
        if (navigator.onLine === false) { LS.set('sync_pendiente', '1'); return { ok: false, motivo: 'offline' }; }
        if (syncEnCurso) return syncEnCurso;

        syncEnCurso = (async () => {
            const enviado = leerProgresoLocal();
            try {
                const r = await api('/api/progreso', { method: 'POST', body: enviado, keepalive });
                if (!r.ok) { LS.set('sync_pendiente', '1'); return { ok: false, motivo: r.data?.msg }; }
                const srv = r.data.progreso;
                // XP: lo aceptado por el servidor + lo que se haya ganado mientras viajaba la petición
                const ganadoDurante = LS.int('usuario_xp') - enviado.xp;
                fusionarProgreso({ ...srv, xp: 0 });
                LS.set('usuario_xp', srv.xp + Math.max(0, ganadoDurante));
                LS.set('xp_sincronizada', srv.xp);
                if (r.data.posicion) LS.set('ranking_pos', r.data.posicion);
                if (ganadoDurante <= 0) LS.del('sync_pendiente');
                const avatar = LS.get('avatar_pendiente');
                if (avatar) {
                    const ra = await api('/api/avatar', { method: 'POST', body: { avatar } });
                    if (ra.ok || ra.status === 400) LS.del('avatar_pendiente');
                }
                return { ok: true, ajustado: r.data.ajustado, progreso: srv };
            } catch (e) {
                LS.set('sync_pendiente', '1');
                return { ok: false, motivo: 'offline' };
            } finally {
                syncEnCurso = null;
            }
        })();
        return syncEnCurso;
    }

    /* Llamar después de cada cambio de progreso (planta, gema, nivel, quiz). */
    function marcarCambio() {
        LS.set('sync_pendiente', '1');
        clearTimeout(syncTimer);
        syncTimer = setTimeout(() => sincronizar(), 1500);
    }

    /* ── 5. Sesión ─────────────────────────────────────────────── */
    function limpiarProgresoLocal() {
        CLAVES_PROGRESO.forEach(LS.del);
        ['ranking_pos', 'menu_visitado', 'avatar_pendiente', 'avatar_style', 'avatar_seed',
         'usuario_avatar', 'usuario_pwd_hash', 'usuario_pwd_tel', 'registro_pendiente'].forEach(LS.del);
    }

    /* Guarda la sesión que devuelve /api/login o /api/register.
       Si en el dispositivo había OTRO jugador, su progreso local se borra;
       si era un invitado (sin teléfono), su progreso se suma a la cuenta. */
    function guardarSesion(usuario, tokenNuevo) {
        const telAnterior = LS.get('usuario_telefono');
        if (telAnterior && telAnterior !== usuario.telefono) limpiarProgresoLocal();

        if (usuario.id != null) LS.set('usuario_id', usuario.id);
        LS.set('usuario_nombre',   usuario.nombre);
        LS.set('usuario_telefono', usuario.telefono);
        LS.set('usuario_genero',   usuario.genero || 'no_decir');
        if (usuario.avatar) {
            LS.set('usuario_avatar', usuario.avatar);
            LS.set('avatar_style',   usuario.avatar);
        }
        if (tokenNuevo) LS.set('usuario_token', tokenNuevo);
        fusionarProgreso(usuario);
        if (usuario.posicion) LS.set('ranking_pos', usuario.posicion);
    }

    async function cerrarSesion() {
        try { await Promise.race([sincronizar(), new Promise(r => setTimeout(r, 3000))]); } catch { /* nada */ }
        try { if (token()) await api('/api/logout', { method: 'POST', timeout: 3000 }); } catch { /* sin red */ }
        LS.del('usuario_token');
    }

    /* ── 6. Sincronización automática ─────────────────────────────
       · al abrir cualquier pantalla
       · al recuperar la conexión
       · al salir / ocultar la pantalla (keepalive)                     */
    function autoSync() {
        if ((LS.get('sync_pendiente') || LS.get('avatar_pendiente')) && token()) sincronizar();
    }
    window.addEventListener('online', autoSync);
    window.addEventListener('load', () => setTimeout(autoSync, 800));
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && LS.get('sync_pendiente') && token()) {
            sincronizar({ keepalive: true });
        }
    });

    /* ── 7. Service worker: se registra desde cualquier pantalla ──
       (antes solo se registraba en index.html; si el jugador entraba
       directo a otra página, el modo sin conexión no quedaba activo)   */
    const scriptActual = document.currentScript && document.currentScript.src;
    if ('serviceWorker' in navigator && scriptActual && window.isSecureContext) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register(new URL('../service-worker.js', scriptActual).href)
                .catch(err => console.warn('[PWA] No se pudo registrar el SW:', err));
        });
    }

    window.Pastuker = {
        API_URL, api, token, LS,
        sincronizar, marcarCambio, leerProgresoLocal, fusionarProgreso,
        guardarSesion, cerrarSesion, limpiarProgresoLocal,
        guardarHashOffline, verificarOffline, cryptoDisponible,
        hayRegistroPendiente: () => !!LS.get('registro_pendiente'),
        estaConectado: () => !!token(),
    };
})();
